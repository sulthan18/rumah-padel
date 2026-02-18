import { CloudClient, Collection } from "chromadb";
import { KNOWLEDGE_BASE } from "./knowledge-base";

const COLLECTION_NAME = "rumah_padel_knowledge";

let chromaClient: CloudClient | null = null;
let collection: Collection | null = null;
let isInitialized = false;
let initializationError: string | null = null;

/**
 * Initialize the ChromaDB Cloud client and seed the collection if empty.
 * Uses ChromaDB's built-in embedding function (no Gemini quota needed).
 */
export async function initVectorStore(): Promise<void> {
    if (isInitialized) return;
    if (initializationError) return;

    try {
        chromaClient = new CloudClient({
            apiKey: process.env.CHROMA_API_KEY || "",
            tenant: process.env.CHROMA_TENANT || "",
            database: process.env.CHROMA_DATABASE || "padel",
        });

        // Get or create collection (uses ChromaDB's default embedding function)
        collection = await chromaClient.getOrCreateCollection({
            name: COLLECTION_NAME,
            metadata: { description: "Rumah Padel knowledge base for RAG chatbot" },
        });

        // Check if already seeded
        const existingCount = await collection.count();
        if (existingCount === 0) {
            console.log("Seeding ChromaDB Cloud with knowledge base...");
            await seedCollection(collection);
            console.log("ChromaDB Cloud seeded successfully.");
        } else {
            console.log(`ChromaDB Cloud already has ${existingCount} documents.`);
        }

        isInitialized = true;
    } catch (error: any) {
        console.warn(
            "ChromaDB Cloud not available, falling back to keyword search:",
            error.message
        );
        initializationError = error.message;
        isInitialized = false;
    }
}

/**
 * Seed the collection with knowledge base documents.
 * ChromaDB generates embeddings server-side using its default embedding function.
 */
async function seedCollection(col: Collection): Promise<void> {
    const ids = KNOWLEDGE_BASE.map((doc) => doc.id);
    const documents = KNOWLEDGE_BASE.map((doc) => doc.content);
    const metadatas = KNOWLEDGE_BASE.map((doc) => doc.metadata);

    // Don't pass embeddings — let ChromaDB's server-side embedding handle it
    await col.add({
        ids,
        documents,
        metadatas,
    });
}

/**
 * Query relevant documents from the vector store.
 * Falls back to keyword search if ChromaDB is not available.
 */
export async function queryRelevantDocs(
    query: string,
    nResults: number = 3
): Promise<string[]> {
    // Try ChromaDB first
    if (isInitialized && collection) {
        try {
            // ChromaDB handles embedding the query text server-side
            const results = await collection.query({
                queryTexts: [query],
                nResults,
            });

            if (results.documents && results.documents[0]) {
                return results.documents[0].filter(
                    (doc): doc is string => doc !== null
                );
            }
        } catch (error) {
            console.error("ChromaDB query failed, falling back:", error);
        }
    }

    // Fallback: simple keyword-based search
    return fallbackSearch(query, nResults);
}

/**
 * Simple keyword-based fallback search when ChromaDB is not available.
 */
function fallbackSearch(query: string, nResults: number): string[] {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/);

    const scored = KNOWLEDGE_BASE.map((doc) => {
        const content = doc.content.toLowerCase();
        let score = 0;

        for (const word of queryWords) {
            if (word.length < 3) continue;
            if (content.includes(word)) {
                score += 1;
            }
        }

        // Boost by category relevance
        const categoryKeywords: Record<string, string[]> = {
            hours: ["jam", "buka", "tutup", "operasional", "hours", "open", "close", "waktu"],
            pricing: ["harga", "biaya", "tarif", "price", "cost", "bayar", "sewa", "rental"],
            courts: ["lapangan", "court", "indoor", "outdoor", "fasilitas"],
            booking: ["booking", "pesan", "reservasi", "book", "reserve"],
            about: ["apa", "padel", "rumah padel", "tentang", "about"],
            features: ["fitur", "feature", "leaderboard", "reward", "community", "public game"],
            equipment: ["alat", "raket", "bola", "sepatu", "equipment"],
            rules: ["aturan", "peraturan", "rule", "rules"],
            skills: ["skill", "level", "beginner", "advanced", "intermediate"],
        };

        const docCategory = doc.metadata.category;
        const relevantKeywords = categoryKeywords[docCategory] || [];
        for (const keyword of relevantKeywords) {
            if (queryLower.includes(keyword)) {
                score += 2;
            }
        }

        return { doc, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored
        .slice(0, nResults)
        .filter((s) => s.score > 0)
        .map((s) => s.doc.content);
}
