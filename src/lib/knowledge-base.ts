/**
 * Knowledge Base for Rumah Padel RAG Chatbot
 * This file contains structured knowledge about the club
 * that will be embedded into the vector store for retrieval.
 */

export interface KnowledgeDocument {
    id: string;
    content: string;
    metadata: {
        category: string;
        source: string;
    };
}

export const KNOWLEDGE_BASE: KnowledgeDocument[] = [
    // About
    {
        id: "about-1",
        content:
            "Rumah Padel adalah klub padel premier di Indonesia. Kami menyediakan fasilitas kelas dunia untuk bermain padel, olahraga raket yang sedang berkembang pesat. Rumah Padel berlokasi strategis dan mudah diakses oleh masyarakat.",
        metadata: { category: "about", source: "site-info" },
    },
    {
        id: "about-2",
        content:
            "Padel adalah olahraga raket yang dimainkan berpasangan dalam lapangan tertutup dengan dinding kaca. Padel menggabungkan elemen tenis dan squash. Padel mudah dipelajari dan cocok untuk semua umur dan level kemampuan.",
        metadata: { category: "about", source: "site-info" },
    },

    // Business Hours
    {
        id: "hours-1",
        content:
            "Rumah Padel buka setiap hari dari jam 6 pagi (06:00) sampai jam 11 malam (23:00). Jam operasional ini berlaku untuk semua lapangan (court). Slot booking tersedia per jam.",
        metadata: { category: "hours", source: "business-config" },
    },

    // Courts
    {
        id: "court-1",
        content:
            "Rumah Padel memiliki 3 lapangan (court). Court 1 adalah Indoor Premium dengan Dinding Kaca (Glass Walls), dilengkapi AC, dan Premium Turf. Harga sewa Court 1 adalah Rp 150.000 per jam.",
        metadata: { category: "courts", source: "business-config" },
    },
    {
        id: "court-2",
        content:
            "Court 2 adalah Indoor Premium dengan LED Lights dan Pro Surface. Harga sewa Court 2 adalah Rp 150.000 per jam. Court ini cocok untuk pemain yang menginginkan pencahayaan optimal.",
        metadata: { category: "courts", source: "business-config" },
    },
    {
        id: "court-3",
        content:
            "Court 3 adalah Outdoor Standard dengan Night Lighting dan Good Airflow. Harga sewa Court 3 adalah Rp 120.000 per jam. Court ini cocok untuk pemain yang menyukai suasana outdoor.",
        metadata: { category: "courts", source: "business-config" },
    },

    // Pricing
    {
        id: "pricing-1",
        content:
            "Harga sewa lapangan di Rumah Padel: Indoor Premium (Court 1 & Court 2) Rp 150.000 per jam. Outdoor Standard (Court 3) Rp 120.000 per jam. Minimum booking 1 jam, maksimum booking 3 jam per sesi.",
        metadata: { category: "pricing", source: "business-config" },
    },

    // Booking
    {
        id: "booking-1",
        content:
            "Cara booking lapangan di Rumah Padel: 1) Login ke akun Anda di website. 2) Pilih tanggal yang diinginkan. 3) Pilih lapangan dan slot waktu yang tersedia. 4) Konfirmasi booking dan lakukan pembayaran. Pembayaran bisa dilakukan melalui Midtrans (berbagai metode pembayaran tersedia).",
        metadata: { category: "booking", source: "features" },
    },
    {
        id: "booking-2",
        content:
            "Setelah booking berhasil, Anda akan mendapatkan email konfirmasi yang berisi detail booking termasuk QR code untuk check-in. Pastikan datang tepat waktu sesuai jadwal booking Anda.",
        metadata: { category: "booking", source: "features" },
    },

    // Features
    {
        id: "feature-1",
        content:
            "Fitur Community di Rumah Padel memungkinkan Anda melihat daftar pemain lain, menambahkan teman, dan bergabung dengan Public Games. Anda bisa melihat profil pemain dan skill level mereka.",
        metadata: { category: "features", source: "features" },
    },
    {
        id: "feature-2",
        content:
            "Leaderboard di Rumah Padel menampilkan peringkat pemain berdasarkan poin yang didapat dari hasil pertandingan. Submit Match Result untuk mencatat hasil pertandingan dan update leaderboard.",
        metadata: { category: "features", source: "features" },
    },
    {
        id: "feature-3",
        content:
            "Rumah Padel memiliki sistem Rewards dan Achievements. Pemain bisa mendapatkan badge dan reward berdasarkan aktivitas mereka di klub. Semakin aktif bermain, semakin banyak reward yang bisa didapatkan.",
        metadata: { category: "features", source: "features" },
    },
    {
        id: "feature-4",
        content:
            "Public Games adalah fitur di mana pemain bisa membuat permainan terbuka yang bisa diikuti oleh pemain lain. Ini memudahkan Anda mencari partner bermain padel.",
        metadata: { category: "features", source: "features" },
    },

    // Equipment
    {
        id: "equipment-1",
        content:
            "Untuk bermain padel Anda membutuhkan: raket padel, bola padel, dan sepatu olahraga yang sesuai. Rumah Padel menyediakan rental raket dan bola untuk pemain yang belum memiliki peralatan sendiri.",
        metadata: { category: "equipment", source: "general-info" },
    },

    // Rules
    {
        id: "rules-1",
        content:
            "Peraturan bermain di Rumah Padel: Harap datang 10 menit sebelum waktu booking. Gunakan sepatu olahraga yang bersih. Jaga kebersihan lapangan. Waktu bermain sesuai dengan durasi booking. Dilarang merokok di area lapangan.",
        metadata: { category: "rules", source: "general-info" },
    },

    // Skill Levels
    {
        id: "skill-1",
        content:
            "Rumah Padel mengkategorikan skill level pemain menjadi: Beginner (pemula), Intermediate (menengah), Advanced (mahir), dan Professional (profesional). Anda bisa mengatur skill level di profil Anda.",
        metadata: { category: "skills", source: "features" },
    },
];
