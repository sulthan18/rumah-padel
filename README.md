# Rumah Padel - Booking System

Premium padel court booking system built with Next.js 14, Prisma, and Supabase.

## 🎾 Features

- **Real-time Booking**: Instant court reservation with calendar interface
- **Payment Integration**: Midtrans payment gateway (QRIS/VA)
- **Email Notifications**: Automated booking confirmations via Resend
- **Dynamic Progress Stepper**: Visual booking flow indicator
- **User Dashboard**: View booking history and QR tickets  
- **NextAuth**: Google OAuth and email authentication

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma (v5.22.0)
- **Auth**: NextAuth.js
- **Payment**: Midtrans
- **Email**: Resend

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Midtrans Sandbox account (for payment testing)
- Resend API key (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sulthan18/rumah-padel.git
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
│   │   ├── api/              # API routes
│   │   ├── booking/          # Booking pages
│   │   └── dashboard/        # User dashboard
│   ├── components/            # React components
│   ├── emails/               # Email templates (React Email)
│   ├── lib/                  # Utilities & configs
│   └── types/                # TypeScript types
└── public/                   # Static assets
```

---

# 📚 Setup Guides

## 💳 Midtrans Payment Setup (Sandbox)

### 1. Register Sandbox Account
1. Go to [Midtrans Sandbox Dashboard](https://dashboard.sandbox.midtrans.com/register)
2. Sign up with Google or email
3. Fill in business details (test data is fine)
4. Verify your email

### 2. Get API Keys
1. Login to [https://dashboard.sandbox.midtrans.com](https://dashboard.sandbox.midtrans.com)
2. Navigate to **Settings → Access Keys**
3. Copy:
   - **Server Key** (starts with `SB-Mid-server-...`)
   - **Client Key** (starts with `SB-Mid-client-...`)

### 3. Update Environment Variables
Add to `.env`:
```bash
MIDTRANS_SERVER_KEY="SB-Mid-server-YOUR_KEY_HERE"
MIDTRANS_CLIENT_KEY="SB-Mid-client-YOUR_KEY_HERE"
MIDTRANS_IS_PRODUCTION="false"

NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-YOUR_KEY_HERE"
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION="false"
```

### 4. Test Payment Methods

#### Credit Card (Success)
- **Card Number**: `4811 1111 1111 1114`
- **Expiry**: `01/25` (any future date)
- **CVV**: `123`

#### GoPay
- Select GoPay → Click "Bayar" in simulator

#### Bank Transfer
- **BCA VA**: `5114 1234 5678`
- **Mandiri Bill**: Auto-approve  
- **BNI VA**: `8888 0000 0000 01`

### Payment Flow
1. User fills checkout → Creates PENDING booking
2. Backend calls Midtrans → Returns Snap Token
3. Frontend shows Snap popup → User pays
4. Midtrans sends webhook → Backend updates to CONFIRMED

### Webhook Setup
- **Development**: Use ngrok to expose localhost
- **Production**: Set to `https://yourdomain.com/api/payment/webhook`

**📖 Docs**: [Midtrans Testing Guide](https://docs.midtrans.com/docs/testing-payment)

---

## 📧 Email Setup (Resend)

### 1. Get API Key
1. Sign up at [resend.com](https://resend.com)
2. Navigate to **API Keys**
3. Create a new key

### 2. Update Environment
Add to `.env`:
```bash
RESEND_API_KEY="re_YOUR_KEY_HERE"
RESEND_FROM_EMAIL="Rumah Padel <onboarding@resend.dev>"
```

### 3. Domain Verification (Optional)
To use a custom sender email (e.g., `admin@rumahpadel.com`):
1. Add domain in Resend Dashboard → **Domains**
2. Update DNS records as instructed
3. Change `RESEND_FROM_EMAIL` to your custom email

> **Note**: Without domain verification, Resend only sends to the email registered in your account (for testing purposes).

---

## 🔐 Google OAuth Setup

### Steps
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create New Project → "Rumah Padel"
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
- **redirect_uri_mismatch**: Ensure URI matches exactly
- **Access blocked**: Add your email to Test Users in OAuth Consent Screen

---

## 🧪 Testing the Booking Flow

### 1. Navigate to Booking
```
http://localhost:3000/booking
```

### 2. Select Date & Court
- Choose future date from calendar
- Select court (Court 1, 2, or 3)
- Pick available time slots

### 3. Checkout & Payment
- Fill customer details (auto-filled if logged in)
- Click "Bayar Sekarang"
- Complete payment in Midtrans popup

### 4. Confirmation
- View e-ticket with QR code
- Receive email confirmation
- Check booking in Dashboard

---

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with courts
- `npx prisma studio` - Open Prisma Studio
- `npx prisma db push` - Push schema changes to database

---

## 🗄️ Database Schema

### Models
- **User**: Authentication and profile
- **Court**: Padel court details
- **Booking**: Reservations with status tracking
- **Payment**: Payment records linked to bookings

### Booking Status Flow
```
PENDING → CONFIRMED → COMPLETED
         ↓
      CANCELLED
```

---

## 🚨 Troubleshooting

### Payment Popup Not Showing
1. Verify server restarted after `.env` changes
2. Check browser console for Snap script errors
3. Confirm using Sandbox URL (`app.sandbox.midtrans.com`)
4. Verify Midtrans keys are correct

### Email Not Received
1. Check spam folder
2. Verify `RESEND_API_KEY` is set
3. Restart dev server to load new env vars
4. Check Resend Dashboard → **Logs** for delivery status

### Dashboard Redirect to Login
- Guest bookings don't appear in dashboard
- Login before booking to link to your account

---

## 📄 License

MIT

---

Built with ❤️ for the padel community
