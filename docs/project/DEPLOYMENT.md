# GlazePulse Deployment

## Durum: Deploy Bekliyor

MVP kodu tamamlandı. Production deployment için organization-level GitHub Actions secrets gerekli.

## Gerekli Secrets

| Secret | Durum |
|--------|-------|
| GH_PAT | CI workflow tarafından doğrulanacak |
| RAILWAY_API_TOKEN | CI workflow tarafından doğrulanacak |
| VERCEL_TOKEN | CI workflow tarafından doğrulanacak |

## Demo Hesabı

| Alan | Değer |
|------|-------|
| E-posta | demo@claywheelstudio.com |
| Şifre | demo123456 |

## Beklenen URL'ler (provision sonrası)

| Kaynak | URL |
|--------|-----|
| Frontend | TBD — Vercel production |
| Backend | TBD — Railway production |
| Health | TBD — `GET /api/health` |

## Ortam Değişkenleri

### Backend (Railway)

```
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=
PORT=4018
```

### Frontend (Vercel)

```
NEXT_PUBLIC_API_URL=
```

## CI Doğrulama

- Backend unit testleri ✅
- Backend build ✅
- Frontend build ✅
- Integration testleri (CI Postgres ile) — push sonrası

## Provisioning

```bash
npm run provision
```

Provisioning scriptleri: `scripts/provision-all.ts`, `scripts/provision-railway.ts`, `scripts/provision-vercel.ts`

## Deployment Blokörleri (2026-06-18)

- Agent ortamında RAILWAY_API_TOKEN / VERCEL_TOKEN yok
- Railway/Vercel GitHub native integration henüz yapılandırılmadı
- `npm run provision` yalnızca CI workflow içinde secrets ile çalışır
