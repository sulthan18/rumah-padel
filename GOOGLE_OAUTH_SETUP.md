# Google OAuth Setup Guide

## 🔐 Cara Setup Google OAuth untuk NextAuth

### 1. Buka Google Cloud Console
Kunjungi: https://console.cloud.google.com/

### 2. Buat Project Baru (atau pilih yang sudah ada)
- Klik dropdown project di header
- Klik "New Project"
- Nama: `Rumah Padel` (atau nama lain)
- Klik "Create"

### 3. Enable Google+ API
- Di sidebar, pilih **APIs & Services** > **Library**
- Cari "Google+ API"
- Klik dan pilih **Enable**

### 4. Buat OAuth Consent Screen
- Di sidebar, pilih **APIs & Services** > **OAuth consent screen**
- Pilih **External** (untuk testing)
- Klik **Create**
- Isi form:
  - App name: `Rumah Padel`
  - User support email: (email kamu)
  - Developer contact: (email kamu)
- Klik **Save and Continue**
- **Scopes**: Skip (klik Save and Continue)
- **Test users**: Tambahkan email kamu untuk testing
- Klik **Save and Continue**

### 5. Buat OAuth Client ID
- Di sidebar, pilih **APIs & Services** > **Credentials**
- Klik **+ CREATE CREDENTIALS** > **OAuth client ID**
- Application type: **Web application**
- Name: `Rumah Padel Web`
- **Authorized JavaScript origins**:
  - `http://localhost:3000`
  - (Nanti tambahkan production URL)
- **Authorized redirect URIs**:
  - `http://localhost:3000/api/auth/callback/google`
  - (Nanti tambahkan production URL)
- Klik **Create**

### 6. Copy Credentials
Setelah dibuat, akan muncul popup dengan:
- **Client ID**: `xxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxx`

### 7. Update File `.env`
Buka file `.env` di root project dan update:

```env
GOOGLE_CLIENT_ID="paste_client_id_disini"
GOOGLE_CLIENT_SECRET="paste_client_secret_disini"
```

### 8. Restart Development Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### 9. Test Login
- Buka: http://localhost:3000/auth/signin
- Klik "Sign in with Google"
- Login dengan akun Google yang sudah ditambahkan sebagai test user
- Seharusnya redirect ke `/dashboard`

## ✅ Checklist
- [ ] Project dibuat di Google Cloud Console
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth Client ID created
- [ ] Credentials di-copy ke `.env`
- [ ] Development server di-restart
- [ ] Test login berhasil

## 🚨 Troubleshooting

**Error: "redirect_uri_mismatch"**
- Pastikan redirect URI di Google Console sama persis dengan yang digunakan NextAuth
- Format: `http://localhost:3000/api/auth/callback/google`

**Error: "Access blocked: This app's request is invalid"**
- Pastikan OAuth consent screen sudah di-configure
- Tambahkan email kamu sebagai test user

**Login berhasil tapi tidak redirect**
- Cek console browser untuk error
- Pastikan database connection berfungsi (Prisma)
- Cek tabel `User`, `Account`, `Session` di Supabase

## 📝 Production Setup (Nanti)
Ketika deploy ke production (Vercel/Netlify):
1. Tambahkan production URL di **Authorized JavaScript origins**:
   - `https://your-domain.com`
2. Tambahkan production callback di **Authorized redirect URIs**:
   - `https://your-domain.com/api/auth/callback/google`
3. Update `.env` production dengan credentials yang sama
