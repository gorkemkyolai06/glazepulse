# GlazePulse — API (API)

Base URL: `{NEXT_PUBLIC_API_URL}` (production: Railway backend URL + `/api`)

## Auth

| Method | Endpoint | Auth | Status | Açıklama |
|--------|----------|------|--------|----------|
| POST | /api/auth/login | No | 200 | Giriş |
| POST | /api/auth/register | No | 201 | Kayıt |

## Health

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/health | No | 200 |

## Tennis Club

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/tennis-club | Yes | 200 |
| PATCH | /api/tennis-club | Yes | 200 |

## Courts

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/courts | Yes | 200 |
| GET | /api/courts/:id | Yes | 200 |
| POST | /api/courts | Yes | 201 |
| PATCH | /api/courts/:id | Yes | 200 |
| DELETE | /api/courts/:id | Yes | 200 |

## Lesson Sessions

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/firing-batches | Yes | 200 |
| GET | /api/firing-batches/:id | Yes | 200 |
| POST | /api/firing-batches | Yes | 201 |
| PATCH | /api/firing-batches/:id | Yes | 200 |
| DELETE | /api/firing-batches/:id | Yes | 200 |

## Ball Machine Maintenance

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/kiln-maintenance | Yes | 200 |
| GET | /api/kiln-maintenance/urgent | Yes | 200 |
| GET | /api/kiln-maintenance/:id | Yes | 200 |
| POST | /api/kiln-maintenance | Yes | 201 |
| PATCH | /api/kiln-maintenance/:id | Yes | 200 |
| DELETE | /api/kiln-maintenance/:id | Yes | 200 |

## Court Maintenance

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/glaze-checklists | Yes | 200 |
| GET | /api/glaze-checklists/:id | Yes | 200 |
| POST | /api/glaze-checklists | Yes | 201 |
| PATCH | /api/glaze-checklists/:id | Yes | 200 |
| DELETE | /api/glaze-checklists/:id | Yes | 200 |

## Stringing Orders

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/clay-orders | Yes | 200 |
| GET | /api/clay-orders/pending | Yes | 200 |
| GET | /api/clay-orders/:id | Yes | 200 |
| POST | /api/clay-orders | Yes | 201 |
| PATCH | /api/clay-orders/:id | Yes | 200 |
| DELETE | /api/clay-orders/:id | Yes | 200 |

## Rate Tiers

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/firing-rates | Yes | 200 |
| GET | /api/firing-rates/:id | Yes | 200 |
| POST | /api/firing-rates | Yes | 201 |
| PATCH | /api/firing-rates/:id | Yes | 200 |
| DELETE | /api/firing-rates/:id | Yes | 200 |

## Dashboard

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/dashboard/stats | Yes | 200 |
