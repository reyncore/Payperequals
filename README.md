# PayPerEquals 🧮💸

> *"Why calculate for free when you can pay for every result?"*

PayPerEquals adalah parodi SaaS kalkulator yang mengenakan biaya **Rp100** setiap kali pengguna menekan tombol `=`. Terlihat profesional, konsepnya absurd — persis seperti banyak startup sungguhan.

---

## ✨ Fitur

- 🏠 **Landing Page** — Hero, pricing, FAQ lucu, footer lengkap
- 🔐 **Auth** — Register / Login / Logout via NextAuth + JWT
- 🧮 **Kalkulator** — Tampilan Apple-style, semua komputasi di server
- 💳 **Top Up** — Simulasi pembayaran (mock mode)
- 📊 **Dashboard** — Saldo, total pengeluaran, riwayat kalkulasi
- 📋 **Riwayat** — Tabel kalkulasi & transaksi dengan pagination
- 👑 **Admin** — Dashboard admin dengan statistik global
- 🌙 **Dark Mode** — Glassmorphism, animasi smooth, responsif
- 🎉 **Pesan Lucu** — Random fun message setiap kali bayar

---

## 🛠 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + Glassmorphism |
| Auth | NextAuth v4 (Credentials + JWT) |
| ORM | Prisma |
| Database | PostgreSQL |
| Math Engine | mathjs (server-side only) |
| Validation | Zod |
| Notifications | react-hot-toast |

---

## 🚀 Setup & Instalasi

### 1. Clone & Install

```bash
git clone <repo-url>
cd payperequals
npm install
```

### 2. Konfigurasi Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/payperequals"
NEXTAUTH_SECRET="ganti-dengan-secret-yang-kuat-minimal-32-karakter"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Setup Database

Pastikan PostgreSQL berjalan, lalu:

```bash
# Generate Prisma client
npm run db:generate

# Push schema ke database
npm run db:push

# (Opsional) Seed data demo
npm run db:seed
```

### 4. Jalankan Dev Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 👤 Akun Demo (setelah seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@payperequals.com` | `admin123` |
| User | `demo@payperequals.com` | `demo123` |

---

## 📁 Struktur Folder

```
payperequals/
├── app/
│   ├── (auth)/           # Login, Register
│   ├── (dashboard)/      # Dashboard, Calculator, TopUp, History
│   ├── admin/            # Admin panel
│   ├── api/              # API Routes
│   │   ├── auth/         # NextAuth + Register
│   │   ├── calculate/    # Core: server-side math evaluation
│   │   ├── topup/        # Mock payment top up
│   │   ├── user/         # User info + dashboard stats
│   │   ├── calculations/ # Riwayat kalkulasi
│   │   ├── transactions/ # Riwayat transaksi
│   │   └── admin/        # Admin stats
│   ├── layout.tsx
│   ├── page.tsx          # Landing page
│   └── globals.css
├── lib/
│   ├── prisma.ts         # Prisma singleton
│   ├── auth.ts           # NextAuth config
│   ├── utils.ts          # Formatters, constants, fun messages
│   └── evaluator.ts      # Safe server-side math evaluator
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Demo data seeder
├── types/
│   └── index.ts          # TypeScript types
└── middleware.ts          # Route protection
```

---

## 🔒 Keamanan

- Semua evaluasi matematika dilakukan **100% di server** — tidak bisa di-bypass dari browser
- Input expression divalidasi dengan whitelist pattern
- Transaksi pengurangan saldo menggunakan **Prisma atomic transaction** — tidak bisa race condition
- Password di-hash dengan bcrypt (cost factor 12)
- Route protection via NextAuth middleware
- Admin endpoint divalidasi role di server

---

## 💰 Cara Kerja Sistem Pembayaran

```
User tekan "=" 
    → Kirim expression ke /api/calculate
    → Server cek auth (JWT)
    → Server cek saldo (atomic lock)
    → Saldo cukup? 
        ✅ Ya → Evaluasi di server → Kurangi saldo → Simpan riwayat → Kembalikan hasil
        ❌ Tidak → HTTP 402 → Tampilkan modal "Top Up"
```

---

## 🎭 Pesan Lucu (Random)

Setiap kali kalkulasi berhasil, user mendapat pesan acak seperti:

- *"Terima kasih telah membiayai operasi matematika. 🧮"*
- *"Server kami bekerja sangat keras menghitung ini. ⚡"*
- *"Angka-angka ini mahal. Tapi Anda berhak mengetahuinya. 💸"*
- *"Rp100 telah dikurangi. Semoga hasilnya sepadan. 🤞"*

---

## 🏗 Production Build

```bash
npm run build
npm start
```

---

## 📝 Environment Variables

| Variable | Keterangan | Required |
|----------|-----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | Secret key JWT (min. 32 char) | ✅ |
| `NEXTAUTH_URL` | Base URL aplikasi | ✅ |
| `NEXT_PUBLIC_APP_URL` | Public URL (sama dengan NEXTAUTH_URL) | ✅ |
| `STRIPE_SECRET_KEY` | Untuk integrasi Stripe nyata | ❌ |

---

## 🤝 Kontribusi

PR welcome! Terutama untuk fitur:
- [ ] Stripe integration (pembayaran nyata!)
- [ ] Leaderboard "Pemborос Terbesar Bulan Ini"
- [ ] Achievement system ("Sudah Bayar 100 Kalkulasi" badge)
- [ ] Scientific calculator mode (+Rp500 per equals)
- [ ] Rate limiting per user

---

*Dibuat dengan ❤️ dan kegilaan. Matematika belum pernah semenyakitkan ini.*
