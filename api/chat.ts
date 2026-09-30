import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

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
    console.error('Failed to initialize GoogleGenAI client on Vercel:', err);
  }
}

const FALLBACK_RESPONSES: Record<string, string> = {
  en: "Namaste, dear. I am Sakhi, your AI wellness assistant. While I am an AI and cannot replace a doctor, for natural comfort try sipping warm ginger-cinnamon tea, applying a warm heating pad to your lower abdomen, and taking slow, deep diaphragmatic breaths. If pain is severe or unbearable, please consult a healthcare professional.",
  hi: "नमस्ते सखी। मैं आपकी AI स्वास्थ्य साथी 'सखी' हूँ। यद्यपि मैं एक AI सहायिका हूँ और डॉक्टर नहीं हूँ, पर प्राकृतिक आराम के लिए आप पेट के निचले हिस्से पर गर्म पानी की थैली से सिकाई कर सकती हैं, अदरक-अजवाइन की गुनगुनी चाय पी सकती हैं और शरीर को पूरा विश्राम दे सकती हैं। यदि दर्द बहुत तीव्र या असहनीय हो, तो कृपया तुरंत डॉक्टर से परामर्श लें।",
  hinglish: "Namaste dear! Main aapki AI wellness companion 'Sakhi' hoon. Main ek AI assistant hoon aur doctor nahi hoon, lekin instant natural relief ke liye aap lower abdomen par warm water bag se sek karein, adrak-ajwain ki garam tea pijiye aur body ko gentle rest dein. Agar pain bahut severe ho, toh please doctor se consult karein."
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, language = 'en', mode = 'standard', persona = 'standard', userCycleContext } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
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

    if (aiClient && apiKey) {
      try {
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
        return res.json({
          reply: replyText,
          model: modelName,
          mode,
          timestamp: new Date().toISOString(),
        });
      } catch (geminiError: unknown) {
        console.warn('Gemini API call failed on Vercel handler:', geminiError);
      }
    }

    return res.json({
      reply: FALLBACK_RESPONSES[currentLang] || FALLBACK_RESPONSES.en,
      model: 'sakhi-caring-fallback',
      mode,
    });
  } catch (error) {
    console.error('Error in Vercel /api/chat:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while communicating with Sakhi.',
    });
  }
}
