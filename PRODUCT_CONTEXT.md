# Homestead v2 — Product & Technical Context

## 1. What this project is

**Homestead** is a **real estate portal MVP**: a single-page web app where users browse property listings and admins manage inventory. It is intentionally small—one Next.js app, two “modes” toggled in the header (no real auth yet), and optional Supabase persistence.

**Positioning today:** Demo/prototype quality. Australian-style sample locations in copy and mock data; prices formatted as **USD**. Contact enquiries are **simulated** (no email/API).

**Goal for the PM:** Define requirements for the **next version** (v2+), knowing what already exists and what is explicitly out of scope.

---

## 2. Tech stack

| Layer | Choice |
|--------|--------|
| Framework | **Next.js 16** (App Router), **React 18**, **TypeScript** |
| Styling | **Tailwind CSS 3.4**, custom `brand` green palette, **Inter** font |
| Icons | **lucide-react** |
| Utilities | `clsx` + `tailwind-merge` (`cn()` helper) |
| Backend / DB | **Supabase** (PostgreSQL + JS client `@supabase/supabase-js`) — optional |
| Hosting (documented) | **Vercel** |
| Node | **18.17+** (20+ recommended) |

**Environment variables (optional):**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

If missing or invalid → app runs in **mock mode** with in-memory/local state.

---

## 3. Project structure (relevant files)

```
homestead-v2/
├── README.md                    # Setup, Supabase, deploy instructions
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── .env.local.example
├── supabase/
│   └── schema.sql               # `listings` table + RLS policies + seed rows
└── src/
    ├── app/
    │   ├── layout.tsx           # Root layout, metadata, Inter font
    │   ├── page.tsx             # Main shell: data loading, view toggle, CRUD orchestration
    │   └── globals.css          # Base styles, glass header utility
    ├── components/
    │   ├── PortalView.tsx       # Public browse: hero, filters, grid, opens modal
    │   ├── PropertyModal.tsx    # Listing detail + contact form (simulated)
    │   └── AdminDashboard.tsx   # Add listing form + listings table + delete
    ├── data/
    │   └── mock-listings.ts     # 4 seed properties (used when Supabase off/unavailable)
    ├── lib/
    │   ├── supabase.ts          # Client, fetch/insert/delete, config detection
    │   └── utils.ts             # formatPrice, listingImage placeholder, cn()
    └── types/
        └── listing.ts           # Listing, ListingInput, ViewMode, DataSource
```

**Single route:** everything lives on `/` (`src/app/page.tsx`). No API routes, no server components for data—client-side Supabase calls from the browser.

---

## 4. Data model

### `Listing` (TypeScript / DB)

| Field | Type | Notes |
|--------|------|--------|
| `id` | string (UUID in DB) | Auto-generated in Supabase |
| `created_at` | optional timestamp | DB default `now()` |
| `title` | string | Required in admin form |
| `description` | string | Default `''` |
| `price` | number | ≥ 0; displayed as USD currency |
| `location` | string | Free text, e.g. "Byron Bay, NSW" |
| `bedrooms` | integer | ≥ 0, default 2 in admin form |
| `bathrooms` | integer | ≥ 0, default 1 in admin form |
| `image_url` | string | Optional; empty → Unsplash placeholder |

### Supabase (`supabase/schema.sql`)

- Table: `public.listings`
- **RLS enabled** with **public** policies: anyone can **SELECT**, **INSERT**, **DELETE** (no UPDATE policy, no auth)
- Optional SQL seed: 2 listings

**Security note for PM:** Current DB policies are wide open—fine for MVP demo, not production.

---

## 5. User roles & desired behavior (as built)

### 5.1 Portal user (“View as Portal User” — default)

1. **Landing hero** with marketing copy (“Find your next home”, Australia-focused).
2. **Filters** (client-side, live as you type):
   - Location: substring match on `location` (case-insensitive)
   - Min / max price: numeric range; empty max = no upper bound
   - “Search” button is present but **filters already apply without clicking it**
3. **Property grid**: cards show image, price badge, title, location, beds/baths, **View Details**.
4. **Empty state** when no listings match filters.
5. **Property detail modal**:
   - Full image, title, location, price, beds/baths, description
   - **Contact agent** form: name, email, message (all required)
   - Submit → **success message only** (no backend, no persistence)
   - Close via X, backdrop click, or Escape; body scroll locked while open

### 5.2 Admin (“View as Admin”)

1. **Add Property** form: title*, description, price*, location*, bedrooms, bathrooms, image URL (optional).
2. On submit → listing added to top of list:
   - **Supabase mode:** `INSERT` to DB, then update UI
   - **Mock mode:** local ID `local-{timestamp}-{random}`, in-memory only (lost on refresh unless Supabase)
3. **Your Listings** table: title, location, price, beds/baths, **Delete** per row.
4. Delete:
   - **Supabase:** `DELETE` by `id`, then update UI
   - **Mock:** remove from local state only
5. **No edit/update** listing flow exists.

### 5.3 App shell (header)

- Brand: **Homestead** — “Real Estate Portal MVP”
- **Data badge:** “Mock data” vs “Supabase” (connectivity indicator)
- **View toggle:** Portal vs Admin (no login—anyone can switch)
- **Status banner** (amber): e.g. mock fallback message, save/delete confirmations, Supabase errors

### 5.4 Data loading logic (`page.tsx`)

On mount:

1. If Supabase **not configured** → load `MOCK_LISTINGS` (4 items), badge = Mock.
2. If configured → fetch all listings ordered by `created_at` desc:
   - Success + rows → Supabase data
   - Success + empty → empty list, message “Connected — no listings yet”
   - Failure → fall back to mock data + error message

Adds/deletes respect current `dataSource` (`mock` | `supabase`).

---

## 6. Mock data (default experience)

Four sample properties in `src/data/mock-listings.ts`:

- Byron Bay, Bondi, Fitzroy, Paddington (AU locations)
- Prices roughly $620k–$1.15M
- One listing has **empty** `image_url` to exercise placeholder behavior

---

## 7. Explicit limitations (not built — good PM backlog seeds)

- **No authentication** (admin vs portal is a UI toggle only)
- **No listing edit** (only add + delete)
- **No real contact/enquiry** storage or email
- **No image upload** (URL string only)
- **No pagination**, sorting UI, or map view
- **No favorites**, saved searches, or user accounts
- **No server-side validation** beyond HTML `required` / browser types
- **No i18n**; currency hardcoded **USD** while copy/locations are Australian
- **No tests** in repo
- **Public Supabase RLS** — insert/delete open to the world if keys are exposed
- Search button is **cosmetic** (filters are reactive)
- README says Next 14; `package.json` has **Next 16**

---

## 8. Non-functional / UX

- Responsive layout (mobile-friendly toggle labels, grid 1→2→3 columns)
- Sticky glass header, emerald brand theme, card hover animations
- Loading spinner on initial fetch
- Deploy path: `npm run build` → Vercel + optional Supabase env vars

---

## 9. Suggested prompt for ChatGPT (PM)

You can append this to the brief:

> You are the product manager for **Homestead**, a real estate listing portal. The codebase above is the **current MVP**. Propose a prioritized roadmap (MVP+1, v1, v2) with user stories, acceptance criteria, and technical notes. Consider: real auth (admin vs buyer), enquiry pipeline, listing CRUD completeness, media handling, AU market (AUD, suburbs), security/RLS, and production readiness. Ask clarifying questions about target users (agency vs FSBO vs aggregator), geography, and monetization before locking scope.

---

## 10. One-line elevator pitch

**Homestead** is a Next.js + Supabase real estate listing browser with an admin panel to add/delete properties, optional cloud persistence, and a simulated buyer enquiry flow—built as a fast MVP to grow into a full portal.
