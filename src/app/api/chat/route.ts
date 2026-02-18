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
        await initVectorStore();

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

        const chat = geminiModel.startChat({
            history: [
                {
                    role: "user",
                    parts: [
                        {
                            text: "Kamu adalah asisten Rumah Padel. Berikut system prompt kamu: " + systemPrompt,
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
        const response = result.response.text();

        return NextResponse.json({
            reply: response,
            sources: relevantDocs.length > 0 ? relevantDocs.slice(0, 2) : [],
        });
    } catch (error: any) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            {
                error: "Maaf, terjadi kesalahan. Silakan coba lagi.",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
