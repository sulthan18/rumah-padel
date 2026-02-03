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

---

# 📚 Documentation & Setup Guides

## 💳 Midtrans Payment Setup

Rumah Padel uses **Midtrans** as the payment gateway.

### Configuration
Credentials in `.env`:
```bash
MIDTRANS_SERVER_KEY="SB-Mid-server-xxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxx"
MIDTRANS_IS_PRODUCTION="false"
```

### Payment Flow
1. **User** fills checkout form -> Creates PENDING booking
2. **Backend** calls Midtrans -> Returns Snap Token
3. **Frontend** shows Snap Popup -> User pays
4. **Midtrans** sends Webhook -> Backend updates status to CONFIRMED

### Webhook Setup
- **Development**: Use ngrok to expose localhost
- **Production**: Set URL to `https://yourdomain.com/api/payment/webhook`

### Testing (Sandbox)
- **QRIS**: Click simulator buttons
- **Credit Card**: Use `4811 1111 1111 1114` (CVV: 123, OTP: 112233)
- **VA**: Use [Midtrans Simulator](https://simulator.sandbox.midtrans.com/)

---

## 🔐 Google OAuth Setup

Setup Google Login for NextAuth.

### Steps
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create New Project -> "Rumah Padel"
3. Enable **Google+ API**
4. Configure **OAuth Consent Screen** (External)
5. Create **OAuth Client ID** (Web Application)
   - **Origins**: `http://localhost:3000`
   - **Redirect URIs**: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID & Secret to `.env`

```env
GOOGLE_CLIENT_ID="your_client_id"
GOOGLE_CLIENT_SECRET="your_client_secret"
```

### Troubleshooting
- **redirect_uri_mismatch**: Ensure URI matches exactly `http://localhost:3000/api/auth/callback/google`
- **Access blocked**: Add your email to Test Users in OAuth Consent Screen

---

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with courts
- `npx prisma studio` - Open Prisma Studio

## 📄 License

MIT

---

Built with ❤️ for the padel community
