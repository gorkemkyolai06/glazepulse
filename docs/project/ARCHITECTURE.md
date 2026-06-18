# GlazePulse — Mimari (ARCHITECTURE)

## Genel Bakış

```
┌─────────────┐     NEXT_PUBLIC_API_URL     ┌─────────────┐
│   Vercel    │ ──────────────────────────► │   Railway   │
│  (Next.js)  │                               │  (NestJS)   │
└─────────────┘                               └──────┬──────┘
                                                     │
                                              ┌──────▼──────┐
                                              │ PostgreSQL  │
                                              │  (Railway)  │
                                              └─────────────┘
```

## Katmanlar

| Katman | Teknoloji | Sorumluluk |
|--------|-----------|------------|
| Frontend | Next.js 14 App Router | UI, auth state, API client |
| Backend | NestJS 10 | REST API, JWT auth, business logic |
| Database | PostgreSQL 16 + Prisma | Veri kalıcılığı, migrations |
| CI | GitHub Actions | Lint, test, build, integration |
| CD | Railway + Vercel | Otomatik deployment |

## Backend Modülleri

- `auth` — JWT login/register
- `health` — GET /api/health
- `tennis-club` — Tesis profili
- `courts` — Kort envanteri
- `firing-batches` — Ders gelir kayıtları
- `kiln-maintenance` — Top makinesi bakım
- `glaze-checklists` — Kort bakım planı
- `clay-orders` — Kordon siparişleri
- `firing-rates` — Tarife kademeleri
- `dashboard` — İstatistikler

## Güvenlik

- JWT Bearer token authentication
- CORS: FRONTEND_URL env variable
- bcrypt password hashing (12 rounds)
- Input validation via class-validator
