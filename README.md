# Calendar Monorepo

Production-ready calendar app monorepo (frontend + backend + postgres + admin panel) with strict date bounds **2000-01-01 to 2099-12-31**.

## Structure

- `backend/` Express + Prisma API
- `frontend/` React + Vite + Tailwind + FullCalendar UI
- `docker-compose.yml` local orchestration

## Setup

### Docker dev

```bash
docker compose up --build
```

### Non-docker dev

```bash
npm install
cd backend && npm install && cp .env.example .env && npx prisma migrate dev && npm run seed && npm run dev
cd frontend && npm install && cp .env.example .env && npm run dev
```

## Production run

```bash
npm run build
cd backend && npm run start
```

## Tests

```bash
npm test
```

## Seed users

- admin@example.com / Admin@12345
- user@example.com / User@12345

## API docs

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/me`

### Events
- `GET /events?from=...&to=...&q=...&category=...&page=...&limit=...`
- `POST /events`
- `GET /events/:id`
- `PUT /events/:id`
- `DELETE /events/:id`
- `POST /events/:id/recurrence`
- `GET /events/:id/occurrences?from=...&to=...`
- `GET /events/export/ics?from=...&to=...`
- `POST /events/import/ics`

### Admin
- `POST /admin/login`
- `GET /admin/users`
- `PATCH /admin/users/:id/ban`
- `PATCH /admin/users/:id/role`
- `GET /admin/audit-logs`
- `DELETE /admin/events/:id`
- `GET /admin/kpis`

## Date validation rule

Every date is validated at API layer (event create/update, recurrence until, occurrence window, ICS import/export) to be within the accepted range. Invalid requests return:

```json
{ "error": { "message": "<field> must be between 2000-01-01 and 2099-12-31." } }
```
