# Cara Setup Midtrans Sandbox (Test Mode)

## 1. Daftar Akun Sandbox

1. Buka [https://dashboard.sandbox.midtrans.com/](https://dashboard.sandbox.midtrans.com/)
2. Klik **"Sign Up"** atau login dengan akun Google
3. Isi data company/personal (data test aja, nggak masalah)

## 2. Dapatkan Sandbox Keys

1. Setelah login, buka **Settings** → **Access Keys**
2. Copy 2 keys ini:
   - **Server Key** (awalan `SB-Mid-server-...`)
   - **Client Key** (awalan `SB-Mid-client-...`)

## 3. Update File `.env`

Buka file `.env` di root project, cari bagian Midtrans, dan replace:

```bash
MIDTRANS_SERVER_KEY="SB-Mid-server-PASTE_SERVER_KEY_DISINI"
MIDTRANS_CLIENT_KEY="SB-Mid-client-PASTE_CLIENT_KEY_DISINI"

NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-PASTE_CLIENT_KEY_DISINI"
```

## 4. Update File `checkout/page.tsx`

Buka `src/app/booking/checkout/page.tsx`, cari bagian **Snap script** (sekitar line 153), dan update:

```tsx
data-client-key="SB-Mid-client-PASTE_CLIENT_KEY_DISINI"
```

## 5. Restart Server

```bash
# Stop server (Ctrl+C), lalu:
npm run dev
```

## 6. Testing Payment

Setelah restart, coba booking lagi. Di Sandbox mode, kamu bisa pakai **kartu test** ini:

### Kartu Kredit Test (Success)
- **Card Number**: `4811 1111 1111 1114`
- **Exp Date**: `01/25` (atau bulan/tahun di masa depan)
- **CVV**: `123`

### GoPay Test
- Klik GoPay → akan muncul QRIS/Deeplink test
- Langsung klik **"Bayar"** tanpa perlu scan app beneran

### Test Lainnya
- **BCA VA**: `5114 1234 5678` (auto-approve)
- **Mandiri Bill**: Kode bayar akan muncul (auto-approve di dashboard)

---

**Dokumentasi lengkap:** https://docs.midtrans.com/docs/testing-payment
