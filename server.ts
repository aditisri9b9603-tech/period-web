import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Google Gen AI client with environment API key
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({});
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
    const { messages, language = 'en', mode = 'standard', userCycleContext } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    const currentLang = language === 'hi' ? 'hi' : language === 'hinglish' ? 'hinglish' : 'en';

    // System instruction defining Sakhi's identity, warmth, safety, and multilingual tone
    const systemInstruction = `You are "Sakhi AI" (सखी AI), an empathetic, caring, and culturally-attuned AI wellness companion for women's menstrual and hormonal health.
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

    // Model selection based on user preference
    let modelName = 'gemini-3.5-flash';
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
        // If high_thinking failed (e.g. paid tier or quota), try gemini-3.5-flash fallback
        if (mode === 'high_thinking') {
          try {
            const fallbackResp = await aiClient.models.generateContent({
              model: 'gemini-3.5-flash',
              contents: messages.map((m: { role: string; content: string }) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
              })),
              config: { systemInstruction },
            });
            res.json({
              reply: fallbackResp.text || FALLBACK_RESPONSES[currentLang],
              model: 'gemini-3.5-flash',
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
