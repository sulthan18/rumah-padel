# Rumah Padel - Booking System

Premium padel court booking system built with Next.js 14, Prisma, and Supabase.

## 🎾 Features

- **Real-time Booking**: Instant court reservation with calendar interface
- **Payment Integration**: Midtrans payment gateway (QRIS/VA)
- **User Dashboard**: View booking history and QR tickets
- **Admin Panel**: Manage schedules and manual slot blocking
- **NextAuth**: Google OAuth and email authentication

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma (v5.22.0)
- **Auth**: NextAuth.js
- **Payment**: Midtrans

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Midtrans account (for payment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/rumah-padel.git
   cd rumah-padel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your credentials in `.env`

4. **Push database schema**
   ```bash
   npx prisma db push
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
rumah-padel/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── app/                   # Next.js app router
│   ├── components/            # React components
│   ├── lib/                   # Utilities & configs
│   └── types/                 # TypeScript types
└── public/                    # Static assets
```

## 🗄️ Database Schema

- **User**: Authentication and profile
- **Court**: Court information and pricing
- **Booking**: Reservation records with status
- **Payment**: Payment tracking
- **Account/Session**: NextAuth tables

## 🎨 Design Optimizations

- **Int vs Decimal**: Using `Int` for prices to avoid Next.js serialization issues
- **Indexes**: Composite indexes on `(courtId, startTime, endTime)` for schedule queries
- **Connection Pooling**: Separate URLs for transactions and migrations

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with courts
- `npx prisma studio` - Open Prisma Studio

## 🔐 Environment Variables

See `.env.example` for required variables.

## 📄 License

MIT

---

Built with ❤️ for the padel community
