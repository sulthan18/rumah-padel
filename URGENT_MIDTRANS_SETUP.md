# ⚠️ URGENT: Setup Midtrans Sandbox Credentials

## Problem
**401 Unauthorized Error** - The demo credentials I provided don't work because Midtrans requires each merchant to register for their own FREE Sandbox account.

## Solution: Get Your Own Sandbox Keys (5 Minutes)

### Step 1: Register Sandbox Account
1. Open: **https://dashboard.sandbox.midtrans.com/register**
2. Click **"Sign Up"** or **"Daftar dengan Google"**
3. Fill in:
   - Business Name: `Rumah Padel` (atau nama apapun)
   - Email: Your email
   - Phone: Your phone number
4. Verify email (check inbox/spam)

### Step 2: Get Your Keys
1. Login to: **https://dashboard.sandbox.midtrans.com**
2. Navigate to: **Settings → Access Keys**
3. You'll see:
   - **Server Key** (starts with `SB-Mid-server-...`)
   - **Client Key** (starts with `SB-Mid-client-...`)
4. **COPY BOTH KEYS**

### Step 3: Update `.env` File
Open `c:/Users/sulth/rumah-padel/.env` and replace:

```bash
# Line 11-12 & 16
MIDTRANS_SERVER_KEY="PASTE_YOUR_SERVER_KEY_HERE"
MIDTRANS_CLIENT_KEY="PASTE_YOUR_CLIENT_KEY_HERE"

NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="PASTE_YOUR_CLIENT_KEY_HERE"
```

### Step 4: Update `checkout/page.tsx`
Open `src/app/booking/checkout/page.tsx`, find line **154**:

```tsx
data-client-key="PASTE_YOUR_CLIENT_KEY_HERE"
```

### Step 5: Restart Server
```bash
# Press Ctrl+C in terminal, then:
npm run dev
```

## ✅ Done!
Now try booking again. The Midtrans popup should show test payment options!

## Test Payment
Once working, use this test card:
- **Card**: 4811 1111 1111 1114
- **Exp**: 01/25
- **CVV**: 123

---

**Important**: Sandbox = **100% FREE testing**, tidak ada biaya sama sekali! 🎉
