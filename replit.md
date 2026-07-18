# Fragment Executor Site

A multi-page Roblox Executor website with a dark cyberpunk aesthetic (dark grays, neon purple/cyan accents).

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + Vite 7, Tailwind CSS v4, Framer Motion, Wouter |
| API Server | Express 5, Pino logging |
| Database | Neon PostgreSQL via Drizzle ORM |
| Monorepo | pnpm workspaces |

## Project structure

```
artifacts/
  executor-site/   # React/Vite frontend (preview path: /)
  api-server/      # Express API server   (preview path: /api)
  mockup-sandbox/  # Canvas mockup server (preview path: /__mockup)
lib/
  db/              # Drizzle ORM schema + Neon connection
  api-zod/         # Zod schemas generated from OpenAPI spec
  api-client-react/# React-Query API client (generated)
  api-spec/        # OpenAPI spec + Orval codegen config
```

## How to run

Both services start automatically via Replit workflows:

- **Frontend** — `pnpm --filter @workspace/executor-site run dev`
- **API Server** — `pnpm --filter @workspace/api-server run dev` (builds then starts)

## Environment / secrets

| Secret | Purpose |
|--------|---------|
| `NEON_DATABASE` | Neon PostgreSQL connection string |
| `SESSION_SECRET` | Express session signing |

## Database

Schema lives in `lib/db/src/schema/`. To push schema changes to Neon:

```bash
NEON_DATABASE="<url>" pnpm --filter @workspace/db run push
```

## Admin panel

Navigate to `/admin` on the frontend. Password is stored in `lib/db/src/store/adminStore.ts` (`ADMIN_PASSWORD`). Config is saved to/loaded from the `admin_config` table in Neon.

## Pages

Home · Download · About · Build · Status · Socials · Credits · Admin (at `/admin`)

## User preferences

- Keep existing monorepo structure
- Use Neon (`NEON_DATABASE`) as the database, not a Replit-provisioned one
