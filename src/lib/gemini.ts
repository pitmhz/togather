import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);

export async function generateDiscussionGuide(topic: string): Promise<string> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not configured");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Buatkan panduan komsel singkat untuk topik: "${topic}". 

Berikan:
- 3 pertanyaan diskusi yang relevan untuk anak muda/dewasa muda
- 1 ayat Alkitab pendukung (dengan referensi lengkap)
- 1 aksi nyata yang bisa dilakukan minggu ini

Format output dalam Markdown bullet points yang rapi. Gunakan bahasa Indonesia yang natural dan relatable untuk anak muda.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("[generateDiscussionGuide] Error:", error);
    throw new Error("Gagal generate materi. Coba lagi nanti.");
  }
}

export async function generateMBTISummary(mbtiType: string, name: string): Promise<string> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not configured");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analisa tipe kepribadian MBTI: ${mbtiType}.
Berikan rangkuman singkat untuk seorang Pemimpin Komunitas (Cell Group Leader) tentang cara memimpin anggota bernama ${name} dengan tipe kepribadian ini.

Format output dalam Markdown:
- **Karakter Utama:** (Jelaskan singkat apakah Thinking vs Feeling, Introvert vs Extrovert, dll)
- **Cara Pendekatan:** (Tips praktis ngobrol/tegur sapa dengan orang tipe ini)
- **Do's & Don'ts:** (Poin penting yang harus dilakukan dan dihindari)

Gunakan bahasa Indonesia yang santai, hangat, dan suportif. Maksimal 200 kata.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("[generateMBTISummary] Error:", error);
    throw new Error("Gagal generate analisa MBTI. Coba lagi nanti.");
  }
}
