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

**Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS 4, shadcn/ui (base-ui variant), Prisma 7 + PostgreSQL (Supabase)

**Database:** PostgreSQL with `@prisma/adapter-pg`. Prisma config uses `DIRECT_URL` for migrations and `DATABASE_URL` for the app. Schema at `prisma/schema.prisma`.

**Prisma client** (`lib/prisma.ts`) uses `PrismaPg` adapter. After any schema change, run `prisma migrate dev` then `prisma generate`.

**RWD Guidelines:**
- **Mobile First**: Use `MobileNav` for screen widths `< md`. The sidebar is hidden on mobile.
- **Sidebar**: Displayed on `md` and above (`hidden md:flex`).
- **Padding**: Use `p-4` on mobile and `p-6` on desktop in layout containers.

**`buttonVariants`:** shadcn's `Button` is a client component. For server components and layouts, import `buttonVariants` from `@/lib/button-variants`. Client form components import `Button` from `@/components/ui/button`.

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

- **寵物管理** `/pets` — CRUD for pet profiles
- **日常照護** `/pets/[petId]/care` — walk, bath, grooming, play, training logs
- **飼料管理** `/pets/[petId]/feeding` — active feed plan + meal records
- **飼料評論** `/pets/[petId]/feeding/reviews` — CRUD for star-rated feed reviews (dedicated page)
- **健康照護** `/pets/[petId]/health` — vet visits, vaccines, medications with next-due-date tracking (full CRUD including edit at `/pets/[petId]/health/[recordId]/edit`)
- **花費記錄** `/pets/[petId]/expenses` — per-pet; `/expenses` — all pets aggregated with category breakdown
- **共同討論區** `/community` — thread-based forum for feed/medication/fresh food/supplement discussions with comments, search, and category filtering
