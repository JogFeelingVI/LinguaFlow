import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  originalText: string;
  timestamp: number;
}

export const languages = [
  { code: 'auto', name: 'Auto Detect' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'ru', name: 'Russian' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
];

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = 'auto'
): Promise<string> {
  if (!text.trim()) return '';

  const systemInstruction = `You are a professional translator. Translate the provided text into the target language accurately and naturally. 
Output ONLY the translated text without any explanations, notes, or prefixes. 
Target Language: ${targetLang}
Source Language: ${sourceLang === 'auto' ? 'detect' : sourceLang}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: text,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    return response.text?.trim() || "Translation failed";
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}

export async function refineText(text: string): Promise<string> {
  if (!text.trim()) return '';

  const systemInstruction = `You are a text editor. Add missing punctuation, fix capitalization, and improve clarity of the provided text while keeping the exact same meaning. 
Output ONLY the refined text. 
If the text is already perfect, output it as is.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: text,
      config: {
        systemInstruction,
        temperature: 0.1,
      },
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Refine error:", error);
    return text;
  }
}
