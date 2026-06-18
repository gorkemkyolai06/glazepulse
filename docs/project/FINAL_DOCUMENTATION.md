# GlazePulse — Final Documentation

## Proje Özeti

| Alan | Değer |
|------|-------|
| **Proje** | glazepulse |
| **Repo** | https://github.com/gorkemkyolai06/glazepulse |
| **Kategori** | B2B SaaS — Seramik Atölyesi Fırın Yönetimi |
| **Hedef Kitle** | ABD bağımsız seramik atölyeleri (3–20 fırın) |
| **Problem** | Pişirim programları, sır partileri ve bakım kayıtları kağıt/Excel ile yönetiliyor |
| **İş Modeli** | SaaS $4–10/fırın/ay |
| **Tamamlanma** | 2026-06-18 |

## Teknik Stack

- **Backend:** NestJS, Prisma, PostgreSQL (port 4018)
- **Frontend:** Next.js 14, Tailwind, shadcn/ui (port 3018)
- **CI:** GitHub Actions + Postgres service

## API Modülleri

- `/api/auth` — login, register, me
- `/api/health` — sağlık kontrolü
- `/api/pottery-studio` — atölye profili
- `/api/kilns` — fırın CRUD
- `/api/firing-batches` — pişirim partileri CRUD
- `/api/kiln-maintenance` — bakım CRUD
- `/api/glaze-checklists` — sır kontrol listeleri CRUD
- `/api/clay-orders` — kil siparişleri CRUD
- `/api/firing-rates` — pişirim tarifeleri CRUD
- `/api/dashboard/stats` — operasyon metrikleri

## Demo Hesabı

- `demo@claywheelstudio.com` / `demo123456`

## Deployment

Deploy bekliyor — bkz. `docs/project/DEPLOYMENT.md`

## Benzersizlik

- **Sektör:** Sanat & zanaat — seramik (önceki projelerden farklı)
- **Hedef:** Atölye sahipleri ve potter'lar (marina, terzi, bowling vb. değil)
- **İş akışı:** Fırın pişirim döngüsü, cone ayarı, sır partileri
- **Tasarım:** Artisan Brutalist + dikey side-rail navigasyon
