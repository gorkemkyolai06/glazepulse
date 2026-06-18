# GlazePulse — Veritabanı (DATABASE)

## PostgreSQL

Connection: `DATABASE_URL` environment variable

## Modeller

| Model | Tablo | Açıklama |
|-------|-------|----------|
| PotteryStudio | pottery_studios | Tenis tesisi profili |
| User | users | Kullanıcı hesapları |
| Court | courts | Kort envanteri |
| FiringBatch | firing_batches | Ders gelir kayıtları |
| KilnMaintenance | kiln_maintenance | Top makinesi bakım |
| GlazeChecklist | glaze_checklists | Kort bakım planı |
| ClayOrder | clay_orders | Kordon siparişleri |
| FiringRate | firing_rates | Tarife kademeleri |

## Migration

```bash
npm run db:migrate   # prisma migrate deploy
npm run db:seed      # prisma db seed
npm run deploy       # migrate + seed + start:prod
```

## Seed Verisi

- 1 tesis: Claywheel Pottery Studio (Phoenix, AZ)
- 1 demo kullanıcı: demo@claywheelstudio.com
- 8 kort (kil, sert, çim, kapalı)
- 2 ders oturumu
- 2 top makinesi bakım kaydı
- 2 kort bakım planı
- 3 fiyat kademesi
- 5 kordon siparişi

Seed idempotent — upsert ile tekrar çalıştırılabilir.
