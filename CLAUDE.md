# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Production build + type check
npm run lint       # ESLint

npx prisma migrate dev --name <name>   # Create and apply new migration
npx prisma migrate deploy              # Apply pending migrations
npx prisma generate                    # Regenerate Prisma client after schema changes
npx prisma studio                      # Open database browser GUI
```

## Architecture

**Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS, shadcn/ui (base-ui variant), Prisma 7 + SQLite (via `@prisma/adapter-better-sqlite3`)

**Database:** SQLite file at `./dev.db` (root of project). Prisma config is in `prisma.config.ts` at root. Schema at `prisma/schema.prisma`.

**Prisma client** (`lib/prisma.ts`) uses `PrismaBetterSqlite3` adapter with a direct path to `./dev.db`. After any schema change, run `prisma migrate dev` then `prisma generate`.

**`buttonVariants`:** shadcn's `Button` is a client component. For server components and layouts, import `buttonVariants` from `@/lib/button-variants` (not from `@/components/ui/button`). Client form components import `Button` from `@/components/ui/button` and `buttonVariants` from `@/lib/button-variants`.

**Server Actions** follow a `(prev: unknown, formData: FormData)` signature — required by React 19's `useActionState`. Actions that need a `dogId` closure wrap the real action in page files (e.g. `async function action(_prev, fd) { "use server"; return createCareRecord(dogId, _prev, fd); }`).

**Data flow:** All reads happen in async Server Components via direct Prisma calls or action helpers in `lib/actions/`. Mutations use Server Actions bound to forms. No API routes.

## Key files

| Path | Purpose |
|------|---------|
| `lib/prisma.ts` | Prisma singleton with better-sqlite3 adapter |
| `lib/types.ts` | Enum label maps (CARE_TYPES, HEALTH_TYPES, EXPENSE_CATEGORIES, etc.) |
| `lib/validations.ts` | Zod schemas for all forms |
| `lib/button-variants.ts` | Server-safe `buttonVariants` cva function |
| `lib/actions/` | Server Actions per domain (dogs, care, feeding, health, expenses) |
| `app/dogs/[dogId]/layout.tsx` | Per-dog layout: fetches dog, renders header + tab nav |
| `components/shared/DeleteButton.tsx` | Reusable delete with AlertDialog confirmation |

## Feature areas

- **犬隻管理** `/dogs` — CRUD for dog profiles
- **日常照護** `/dogs/[dogId]/care` — walk, bath, grooming, play, training logs
- **飼料管理** `/dogs/[dogId]/feeding` — active feed plan + meal records
- **健康照護** `/dogs/[dogId]/health` — vet visits, vaccines, medications with next-due-date tracking
- **花費記錄** `/dogs/[dogId]/expenses` — per-dog; `/expenses` — all dogs aggregated with category breakdown
