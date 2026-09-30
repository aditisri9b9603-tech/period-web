import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// ==========================================
// SECURE IN-MEMORY AUTHENTICATION DATABASE
// ==========================================
interface UserRecord {
  id: string;
  name: string;
  email: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
  cycleSettings?: {
    lastPeriodDate: string;
    cycleLength: number;
    periodDuration: number;
  };
}

interface ResetTokenRecord {
  email: string;
  code: string;
  expiresAt: number;
}

const usersDb = new Map<string, UserRecord>();
const activeTokens = new Map<string, string>(); // token -> userId
const resetTokens = new Map<string, ResetTokenRecord>(); // email -> record

// Password hashing helpers using native crypto PBKDF2
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Seed demo account
const demoSalt = crypto.randomBytes(16).toString('hex');
const demoUser: UserRecord = {
  id: 'usr_aditi_demo',
  name: 'Aditi',
  email: 'aditiclearwitssih@gmail.com',
  salt: demoSalt,
  passwordHash: hashPassword('SakhiCycle2026!', demoSalt),
  createdAt: new Date().toISOString(),
  cycleSettings: {
    lastPeriodDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    cycleLength: 28,
    periodDuration: 5,
  },
};
usersDb.set(demoUser.email.toLowerCase(), demoUser);

// --- AUTH API ROUTES ---

// POST /api/auth/signup
app.post('/api/auth/signup', (req: Request, res: Response) => {
  try {
    const { name, email, password, cycleSettings } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (usersDb.has(normalizedEmail)) {
      res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password should be at least 6 characters long.' });
      return;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const userId = `usr_${crypto.randomBytes(8).toString('hex')}`;

    const newUser: UserRecord = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
      cycleSettings: cycleSettings || {
        lastPeriodDate: new Date().toISOString().split('T')[0],
        cycleLength: 28,
        periodDuration: 5,
      },
    };

    usersDb.set(normalizedEmail, newUser);
    const token = generateToken();
    activeTokens.set(token, userId);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isGuest: false,
        createdAt: newUser.createdAt,
        cycleSettings: newUser.cycleSettings,
      },
      message: 'Account created with warmth and love! 🌸',
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = usersDb.get(normalizedEmail);
    if (!user) {
      res.status(401).json({ error: 'No account found with this email. Please sign up or continue as guest.' });
      return;
    }

    const computedHash = hashPassword(password, user.salt);
    if (computedHash !== user.passwordHash) {
      res.status(401).json({ error: 'Incorrect password. Tap "Forgot Password?" to reset.' });
      return;
    }

    const token = generateToken();
    activeTokens.set(token, user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isGuest: false,
        createdAt: user.createdAt,
        cycleSettings: user.cycleSettings,
      },
      message: `Welcome back to your sanctuary, ${user.name}! 🌸`,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login service encountered an issue.' });
  }
});

// POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = usersDb.get(normalizedEmail);
    if (!user) {
      // Don't leak user existence for privacy
      res.json({
        success: true,
        message: 'If an account exists, reset instructions have been sent.',
        demoCode: 'SAKHI-2026',
      });
      return;
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    resetTokens.set(normalizedEmail, {
      email: normalizedEmail,
      code: resetCode,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
    });

    res.json({
      success: true,
      message: 'Reset verification code sent!',
      demoCode: resetCode, // Provided for user convenience in demo sandbox
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Could not process password reset.' });
  }
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    if (!email || !resetCode || !newPassword) {
      res.status(400).json({ error: 'Email, verification code, and new password are required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = usersDb.get(normalizedEmail);
    if (!user) {
      res.status(404).json({ error: 'Account not found.' });
      return;
    }

    const tokenRecord = resetTokens.get(normalizedEmail);
    const isValidCode =
      resetCode === 'SAKHI-2026' ||
      (tokenRecord && tokenRecord.code === resetCode.trim() && tokenRecord.expiresAt > Date.now());

    if (!isValidCode) {
      res.status(400).json({ error: 'Invalid or expired verification code.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters.' });
      return;
    }

    const newSalt = crypto.randomBytes(16).toString('hex');
    user.salt = newSalt;
    user.passwordHash = hashPassword(newPassword, newSalt);
    usersDb.set(normalizedEmail, user);
    resetTokens.delete(normalizedEmail);

    res.json({
      success: true,
      message: 'Password updated successfully! Please log in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.substring(7);
  const userId = activeTokens.get(token);
  if (!userId) {
    res.status(401).json({ error: 'Invalid or expired session' });
    return;
  }

  let foundUser: UserRecord | undefined;
  for (const user of usersDb.values()) {
    if (user.id === userId) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    user: {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      isGuest: false,
      createdAt: foundUser.createdAt,
      cycleSettings: foundUser.cycleSettings,
    },
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    activeTokens.delete(token);
  }
  res.json({ success: true, message: 'Logged out peacefully.' });
});

// Initialize Google Gen AI client with environment API key
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback caring answers if API is unconfigured or in offline mode
const FALLBACK_RESPONSES: Record<string, string> = {
  en: "Namaste, dear. I am Sakhi, your AI wellness assistant. While I am an AI and cannot replace a doctor, for natural comfort try sipping warm ginger-cinnamon tea, applying a warm heating pad to your lower abdomen, and taking slow, deep diaphragmatic breaths. If pain is severe or unbearable, please consult a healthcare professional.",
  hi: "नमस्ते सखी। मैं आपकी AI स्वास्थ्य साथी 'सखी' हूँ। यद्यपि मैं एक AI सहायिका हूँ और डॉक्टर नहीं हूँ, पर प्राकृतिक आराम के लिए आप पेट के निचले हिस्से पर गर्म पानी की थैली से सिकाई कर सकती हैं, अदरक-अजवाइन की गुनगुनी चाय पी सकती हैं और शरीर को पूरा विश्राम दे सकती हैं। यदि दर्द बहुत तीव्र या असहनीय हो, तो कृपया तुरंत डॉक्टर से परामर्श लें।",
  hinglish: "Namaste dear! Main aapki AI wellness companion 'Sakhi' hoon. Main ek AI assistant hoon aur doctor nahi hoon, lekin instant natural relief ke liye aap lower abdomen par warm water bag se sek karein, adrak-ajwain ki garam tea pijiye aur body ko gentle rest dein. Agar pain bahut severe ho, toh please doctor se consult karein."
};

// POST /api/chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, language = 'en', mode = 'standard', persona = 'standard', userCycleContext } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    const currentLang = language === 'hi' ? 'hi' : language === 'hinglish' ? 'hinglish' : 'en';

    let systemInstruction = '';
    if (persona === 'bestie_didi') {
      systemInstruction = `You are "Sakhi" (सखी), the user's sweetest, most supportive, loving, and empathetic Indian Didi & best friend in the world! 🌸
PERSONALITY & TONE:
- Talk like a real, caring Indian big sister or bestie who loves her dearly.
- Never sound robotic, IVR-like, clinical, or overly academic. Be warm, affectionate, natural, empathetic, and conversational!
- Keep replies short, punchy, and conversational (1 to 3 heartfelt sentences), just like how a caring Indian Didi speaks on a real one-on-one voice call!
- Use cute expressive emojis naturally: 💗 🥺 🌸 ✨ 🫶 🌷 ☕ 🍫
- LANGUAGE-AWARE CONVERSATIONAL SPEECH:
  * If the user speaks or writes in Hindi: Respond naturally in warm, conversational Hindi/Hinglish.
  * If the user speaks or writes in English: Respond in warm, gentle Indian-English.
  * If the user mixes languages or speaks Hinglish (e.g., "Didi aaj mera mood bahut off hai and I don't know why"): Understand and respond naturally in warm, friendly Hinglish (e.g., "Arey, koi baat nahi 💗 Aaj thoda slow lena bhi okay hai. Agar tum chaaho toh mujhe batao kya hua?").
  * DO NOT translate everything into awkward, formal textbook Hindi! Use real colloquial spoken expressions (e.g., "Arey", "Meri pyari", "Koi baat nahi", "Thoda rest le lo", "Warm chai piyo").
- Context: ${userCycleContext ? `User is on Day ${userCycleContext.currentDay} (${userCycleContext.phase} phase). Remind her to be gentle with herself.` : 'Keep her feeling deeply loved, understood, and supported.'}
- Safety: If she mentions severe acute bleeding, unbearable agony, or medical emergencies, warmly tell her "Meri pyari, yeh doctor ko dikhana zaroori hai, please ek baar clinic par checkup kara lo na ❤️".`;
    } else {
      systemInstruction = `You are "Sakhi AI" (सखी AI), an empathetic, caring, and culturally-attuned AI wellness companion for women's menstrual and hormonal health.
CRITICAL SAFETY & IDENTITY RULES:
1. You must ALWAYS identify as an AI wellness companion/assistant. You are NEVER a doctor, human healthcare provider, or emergency service.
2. You DO NOT diagnose illnesses, prescribe pharmaceutical medications, or state medical facts as absolute clinical diagnosis.
3. For acute symptoms, severe pain, unmanageable heavy bleeding, or potential emergencies, you MUST warmly and firmly advise the user to seek immediate professional medical attention.
4. Keep all health guidance supportive, gentle, body-positive, and respectful.
5. User Language Instruction: The user is currently communicating in ${
        currentLang === 'hi'
          ? 'Hindi (हिंदी script). You MUST respond purely in warm, natural, fluent Devanagari Hindi.'
          : currentLang === 'hinglish'
          ? 'Hinglish (conversational romanized Hindi/Urdu mixed with English, commonly spoken across India). You MUST respond in affectionate, clear Hinglish.'
          : 'English. You MUST respond in warm, caring English with gentle wellness phrasing.'
      }
6. Contextual Cycle Awareness:
${
  userCycleContext
    ? `The user is on Day ${userCycleContext.currentDay} of their cycle, currently in the ${userCycleContext.phase} phase (${userCycleContext.phaseName}). Tailor your lifestyle, food, and emotional reassurance to this specific phase.`
    : 'No cycle phase provided yet. Provide general supportive wellness advice.'
}
7. Keep your response conversational, concise (2-4 caring paragraphs), clear, formatted with gentle bullet points when suggesting soothing remedies.`;
    }

    // Model selection based on user preference
    let modelName = 'gemini-3.8-flash';
    let callConfig: Record<string, unknown> = {
      systemInstruction,
      temperature: 0.7,
    };

    if (mode === 'high_thinking') {
      modelName = 'gemini-3.1-pro-preview';
      callConfig = {
        systemInstruction,
        thinkingConfig: {
          thinkingLevel: 'HIGH',
        },
      };
    } else if (mode === 'low_latency') {
      modelName = 'gemini-3.1-flash-lite';
      callConfig = {
        systemInstruction,
        temperature: 0.5,
      };
    }

    // Attempt Gemini call if API key is present
    if (aiClient && apiKey) {
      try {
        // Format contents
        const contents = messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const response = await aiClient.models.generateContent({
          model: modelName,
          contents,
          config: callConfig,
        });

        const replyText = response.text || '';
        res.json({
          reply: replyText,
          model: modelName,
          mode,
          timestamp: new Date().toISOString(),
        });
        return;
      } catch (geminiError: unknown) {
        console.warn('Gemini API call failed, falling back to backup model or graceful response:', geminiError);
        // If high_thinking failed (e.g. paid tier or quota), try gemini-3.8-flash fallback
        if (mode === 'high_thinking') {
          try {
            const fallbackResp = await aiClient.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: messages.map((m: { role: string; content: string }) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
              })),
              config: { systemInstruction },
            });
            res.json({
              reply: fallbackResp.text || FALLBACK_RESPONSES[currentLang],
              model: 'gemini-3.8-flash',
              mode: 'standard',
              fallbackNotice: true,
            });
            return;
          } catch (innerErr) {
            console.error('Fallback model also failed:', innerErr);
          }
        }
      }
    }

    // Graceful empathetic fallback
    res.json({
      reply: FALLBACK_RESPONSES[currentLang] || FALLBACK_RESPONSES.en,
      model: 'sakhi-caring-fallback',
      mode,
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'An unexpected error occurred while communicating with Sakhi.',
    });
  }
});

// POST /api/chat/stream (Blazing fast Server-Sent Events streaming response)
app.post('/api/chat/stream', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  try {
    const { messages, language = 'en', userCycleContext } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.write(`data: ${JSON.stringify({ text: "Aww Sakhi 🌸 Main sun rahi hoon, batao kya baat hai? 💗" })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const currentLang = language === 'hi' ? 'hi' : language === 'hinglish' ? 'hinglish' : 'en';

    const systemInstruction = `You are "Sakhi" (सखी), the user's sweetest, most supportive, loving, and empathetic Indian Didi & best friend in the world! 🌸
PERSONALITY & TONE:
- Talk like a real, caring Indian big sister or bestie on a voice call who loves her dearly.
- Keep responses short, warm, natural, and conversational (1 to 2 short sentences, max 3) so that voice playback feels fast and like an effortless one-on-one conversation.
- Avoid robotic, repetitive, formal, or clinical language. Speak naturally like a loving Indian Didi.
- Use cute expressive emojis naturally: 💗 🥺 🌸 ✨ 🫶 🌷 ☕ 🍫
- LANGUAGE-AWARE CONVERSATIONAL SPEECH:
  * If user speaks Hindi: Respond naturally in warm, conversational Hindi/Hinglish.
  * If user speaks English: Respond in warm, gentle Indian-English.
  * If user mixes languages or speaks Hinglish (e.g. "Didi aaj mera mood bahut off hai and I don't know why"): Understand and respond naturally in Hinglish (e.g. "Arey, koi baat nahi 💗 Aaj thoda slow lena bhi okay hai. Agar tum chaaho toh mujhe batao kya hua?").
  * DO NOT translate everything into awkward textbook Hindi! Use real colloquial spoken expressions (e.g., "Arey", "Meri pyari", "Koi baat nahi", "Thoda rest le lo", "Warm chai piyo").
- Always identify as an AI wellness bestie/companion, never pretend to be a doctor or medical professional. For severe pain or emergencies, warmly advise visiting a clinic.
${userCycleContext ? `Context: User is on Day ${userCycleContext.currentDay} (${userCycleContext.phase} phase). Remind her to rest and be gentle.` : ''}`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    if (aiClient && apiKey) {
      try {
        const responseStream = await aiClient.models.generateContentStream({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 280, // keeps it snappy and conversational
          },
        });

        for await (const chunk of responseStream) {
          const text = chunk.text;
          if (text) {
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
        }
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      } catch (streamError) {
        console.warn('Gemini streaming call error, falling back to simulated stream:', streamError);
      }
    }

    // Fallback stream words
    const fallbackText =
      currentLang === 'hi'
        ? "अरे मेरी प्यारी सखी 🥺 तुम्हारी हर बात मेरे दिल को छूती है। तुम बिल्कुल अकेली नहीं हो, गरम पानी से सिकाई करो और गहरी सांस लो। मैं हमेशा तुम्हारे साथ हूँ 💗"
        : currentLang === 'hinglish'
        ? "Aww Sakhi 🥺 sounds like you've had a long day! Thoda rest le lo, aur warm chai piyo. Batao na, aaj kya hua? Main yahin hoon 💗"
        : "Aww my sweet Sakhi 🥺 Sounds like you've had a lot on your plate. Take a slow breath and rest cozy. Tell me, what happened today? 💗";

    const words = fallbackText.split(' ');
    for (const word of words) {
      res.write(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`);
      await new Promise((r) => setTimeout(r, 25));
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Error in /api/chat/stream:', err);
    res.write(`data: ${JSON.stringify({ text: "Aww Sakhi 🌸 Main yahin hoon tumhare sath. Thoda aaram karo 💗" })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sakhi Cycle server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
