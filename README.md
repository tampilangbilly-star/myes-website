# M-YES Website — Next.js + MySQL
## Manado Youth English Service

Website komunitas M-YES dengan Admin Dashboard, CRUD, upload foto, bilingual (EN/ID), slider homepage, dan social media integration. Semua dalam 1 project Next.js.

---

## 🔧 PANDUAN INSTALASI

### Prasyarat
- Node.js 18+ (download: https://nodejs.org)
- XAMPP (MySQL harus running)

### Langkah Setup

```bash
# 1. Masuk ke folder project
cd myes-nextjs

# 2. Install dependencies
npm install

# 3. Copy environment file
copy .env.example .env

# 4. Pastikan MySQL XAMPP running, buat database
#    Buka http://localhost/phpmyadmin → New → myes_db → Create

# 5. Push schema ke database
npx prisma db push

# 6. Seed data awal
npm run db:seed

# 7. Jalankan development server
npm run dev
```

### Akses
- **Website:** http://localhost:3000
- **Admin:** http://localhost:3000/admin
- **Login:** admin@myes.com / myes2026

---

## 📁 STRUKTUR

```
myes-nextjs/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.js          # Data awal
├── public/uploads/      # File upload storage
├── src/
│   ├── app/
│   │   ├── page.js              # Homepage (slider + programs + news)
│   │   ├── about/page.js        # About Us
│   │   ├── personnel/page.js    # Personnel
│   │   ├── program/page.js      # Programs
│   │   ├── activities/page.js   # Weekly Activities
│   │   ├── mission/page.js      # Mission Trip
│   │   ├── news/page.js         # News
│   │   ├── contact/page.js      # Contact
│   │   ├── admin/               # Admin Dashboard (all pages)
│   │   └── api/                 # API Routes (CRUD + upload)
│   ├── components/
│   │   ├── Navbar.js            # Navigation bar
│   │   ├── Footer.js            # Footer
│   │   ├── HeroSlider.js        # Homepage slider
│   │   ├── SocialBar.js         # Social media bar
│   │   ├── SocialFloat.js       # Floating social button
│   │   ├── SlideForm.js         # Slide create/edit form
│   │   └── SessionProvider.js   # Auth provider
│   └── lib/
│       ├── prisma.js            # Database client
│       ├── auth.js              # NextAuth config
│       └── helpers.js           # Translation helper
└── .env.example
```

## 🎯 FITUR
- Homepage dengan auto-rotate slider (kelola dari admin)
- Social media bar (IG, FB, TikTok, WA) selalu terlihat
- Bilingual (EN/ID) via cookie
- Admin Dashboard dark theme
- CRUD: Slides, Personnel, Programs, Activities, Missions, News
- Settings: About, Social Media, Contact, Background foto
- Upload foto untuk semua konten
- 1 project, 1 deploy

---

© 2026 M-YES Manado Youth English Service
