
import { PrismaClient, CourtType, CourtSurface } from "@prisma/client"

const prisma = new PrismaClient()

const COURT_IMAGES = [
    "https://images.unsplash.com/photo-1627521349637-8339b1654326?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621251347683-17637500593b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599474924187-334a405be2fa?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576610616656-d302d16a180d?q=80&w=800&auto=format&fit=crop", // Tennis/Court
    "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?q=80&w=800&auto=format&fit=crop", // Clay
    "https://images.unsplash.com/photo-1599586120429-48285b6a8a29?q=80&w=800&auto=format&fit=crop", // Green court
    "https://images.unsplash.com/photo-1560156713-7364103df52f?q=80&w=800&auto=format&fit=crop", // Indoor abstract
    "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop", // Outdoor sunny
]

const COURTS_DATA = [
    // INDOOR - CARPET (Premium)
    { name: "Grand Arena", type: "INDOOR", surface: "CARPET", price: 250000, desc: "Main center court with stadium seating." },
    { name: "The Thunderdome", type: "INDOOR", surface: "CARPET", price: 220000, desc: "High-ceiling competitive arena." },
    { name: "Viper Court", type: "INDOOR", surface: "CARPET", price: 200000, desc: "Precision surface for fast play." },
    { name: "Elite One", type: "INDOOR", surface: "CARPET", price: 200000, desc: "Exclusive usage for pro members." },
    { name: "The Vault", type: "INDOOR", surface: "CARPET", price: 180000, desc: "Sound-proofed intense training zone." },
    { name: "Shadow Realm", type: "INDOOR", surface: "CARPET", price: 180000, desc: "Dramatic lighting for atmospheric play." },

    // INDOOR - GRASS
    { name: "Green House", type: "INDOOR", surface: "GRASS", price: 175000, desc: "Soft synthetic grass indoors." },
    { name: "The Lawn", type: "INDOOR", surface: "GRASS", price: 175000, desc: "Wimbledon style indoor experience." },
    { name: "Oasis", type: "INDOOR", surface: "GRASS", price: 175000, desc: "Relaxed vibe with turf flooring." },
    { name: "Zen Court", type: "INDOOR", surface: "GRASS", price: 160000, desc: "Perfect balance of grip and slide." },

    // OUTDOOR - CARPET (Rare but existing)
    { name: "Sky Deck", type: "OUTDOOR", surface: "CARPET", price: 150000, desc: "Rooftop carpet court with a view." },
    { name: "Sun Trap", type: "OUTDOOR", surface: "CARPET", price: 150000, desc: "Bright and fast playing surface." },

    // OUTDOOR - GRASS
    { name: "Palm Court", type: "OUTDOOR", surface: "GRASS", price: 120000, desc: "Surrounded by tropical nature." },
    { name: "Sunset Blvd", type: "OUTDOOR", surface: "GRASS", price: 120000, desc: "Best played during golden hour." },
    { name: "Ocean Breeze", type: "OUTDOOR", surface: "GRASS", price: 130000, desc: "Open air flow system." },
    { name: "Canyon", type: "OUTDOOR", surface: "GRASS", price: 130000, desc: "Surrounded by acoustic walls." },
    { name: "Dune", type: "OUTDOOR", surface: "GRASS", price: 110000, desc: "Sand-filled turf for max slide." },
    { name: "Safari", type: "OUTDOOR", surface: "GRASS", price: 110000, desc: "Adventure themed outdoor court." },

    // EXTRA / TRAINING
    { name: "Training Ground A", type: "OUTDOOR", surface: "GRASS", price: 100000, desc: "Dedicated for coaching sessions." },
    { name: "Training Ground B", type: "OUTDOOR", surface: "GRASS", price: 100000, desc: "Dedicated for coaching sessions." },
    { name: "Academy 1", type: "INDOOR", surface: "CARPET", price: 140000, desc: "Junior academy standard court." },
    { name: "Academy 2", type: "INDOOR", surface: "CARPET", price: 140000, desc: "Junior academy standard court." },
    { name: "The Cage", type: "INDOOR", surface: "CARPET", price: 190000, desc: "Enclosed iron-mesh industrial style." },
    { name: "Final Stage", type: "INDOOR", surface: "CARPET", price: 300000, desc: "Championship final match court." }
]

async function main() {
    console.log("🌱 Seeding Courts...")

    // Clear existing courts to avoid duplicates/mess (optional, but good for dev)
    // await prisma.court.deleteMany({}) 
    // Commented out to be safe, but in dev we might want to truncate.
    // Let's just create them. If we want fresh, we can manually delete first or assume empty DB.
    // For this task, let's delete existing to ensure clean slate for pagination testing

    try {
        await prisma.court.deleteMany({})
        console.log("Deleted existing courts.")
    } catch (e) {
        console.log("Error deleting courts (maybe table empty):", e)
    }

    for (let i = 0; i < COURTS_DATA.length; i++) {
        const data = COURTS_DATA[i]
        // Cycle through images
        const imageUrl = COURT_IMAGES[i % COURT_IMAGES.length]

        await prisma.court.create({
            data: {
                name: data.name,
                description: data.desc,
                type: data.type as CourtType,
                surface: data.surface as CourtSurface,
                pricePerHour: data.price,
                imageUrl: imageUrl,
                isActive: true
            }
        })
        console.log(`Created: ${data.name}`)
    }

    console.log("✅ Seeding Complete!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
