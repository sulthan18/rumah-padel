import { NextRequest, NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";
import { initVectorStore, queryRelevantDocs } from "@/lib/vector-store";

const SYSTEM_PROMPT = `Kamu adalah asisten virtual dari Rumah Padel, klub padel premier di Indonesia.
Tugas kamu adalah membantu pengunjung dan member dengan pertanyaan seputar Rumah Padel.

Panduan:
- Jawab dalam bahasa yang sama dengan pertanyaan user (Indonesia atau English).
- Berikan jawaban yang ramah, informatif, dan ringkas.
- Jika informasi tidak tersedia dalam konteks, katakan dengan sopan bahwa kamu tidak memiliki informasi tentang hal tersebut dan sarankan user untuk menghubungi admin.
- Jangan membuat informasi palsu atau mengarang data.
- Gunakan emoji secukupnya untuk membuat percakapan lebih menarik.
- Format jawaban agar mudah dibaca.

Berikut adalah informasi yang relevan dari knowledge base:
{context}
`;

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGeminiWithRetry(
    message: string,
    systemPrompt: string,
    chatHistory: { role: string; parts: { text: string }[] }[],
    retries = 2
): Promise<string> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const chat = geminiModel.startChat({
                history: [
                    {
                        role: "user",
                        parts: [
                            {
                                text:
                                    "Kamu adalah asisten Rumah Padel. Berikut system prompt kamu: " +
                                    systemPrompt,
                            },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            {
                                text: "Baik, saya siap membantu sebagai asisten virtual Rumah Padel! 🎾 Silakan tanyakan apa saja tentang klub kami.",
                            },
                        ],
                    },
                    ...chatHistory,
                ],
            });

            const result = await chat.sendMessage(message);
            return result.response.text();
        } catch (error: any) {
            const isRateLimit =
                error.status === 429 ||
                error.message?.includes("429") ||
                error.message?.includes("RESOURCE_EXHAUSTED") ||
                error.message?.includes("quota");

            if (isRateLimit && attempt < retries) {
                const waitTime = (attempt + 1) * 3000; // 3s, 6s
                console.log(
                    `Gemini rate limited, retrying in ${waitTime / 1000}s (attempt ${attempt + 1}/${retries})...`
                );
                await sleep(waitTime);
                continue;
            }
            throw error;
        }
    }
    throw new Error("Max retries reached");
}

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Initialize vector store (will try ChromaDB, falls back gracefully)
        try {
            await initVectorStore();
        } catch (e: any) {
            console.warn("Vector store init warning:", e.message);
        }

        // Retrieve relevant documents
        const relevantDocs = await queryRelevantDocs(message, 3);
        const context =
            relevantDocs.length > 0
                ? relevantDocs.join("\n\n")
                : "Tidak ada informasi spesifik yang ditemukan di knowledge base.";

        const systemPrompt = SYSTEM_PROMPT.replace("{context}", context);

        // Build chat history
        const chatHistory = (history || []).map(
            (msg: { role: string; content: string }) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }],
            })
        );

        const response = await callGeminiWithRetry(
            message,
            systemPrompt,
            chatHistory
        );

        return NextResponse.json({
            reply: response,
            sources: relevantDocs.length > 0 ? relevantDocs.slice(0, 2) : [],
        });
    } catch (error: any) {
        console.error("Chat API error:", error.message || error);

        const isRateLimit =
            error.status === 429 ||
            error.message?.includes("429") ||
            error.message?.includes("RESOURCE_EXHAUSTED");

        return NextResponse.json(
            {
                error: isRateLimit
                    ? "Mohon maaf, layanan sedang sibuk. Silakan coba lagi dalam beberapa detik. ⏳"
                    : "Maaf, terjadi kesalahan. Silakan coba lagi.",
                details: error.message,
            },
            { status: isRateLimit ? 429 : 500 }
        );
    }
}

