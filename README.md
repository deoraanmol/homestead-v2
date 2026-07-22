# Homestead v2

Real estate portal MVP built with **Next.js 14**, **Tailwind CSS**, and **Supabase**.

- **Portal view** — browse listings, filter by location and price, open detail modal with contact form
- **Admin view** — add and delete property listings
- **Mock mode** — works immediately without Supabase (4 sample listings)
- **Supabase mode** — optional; syncs listings to your database when env vars are set

## Prerequisites

- **Node.js 18+** (20+ recommended). Check with `node -v`
- **npm 10+**. Check with `npm -v`

If you use nvm:

```bash
nvm use 22   # or: nvm install 22 && nvm use 22
```

## Run locally

```bash
cd ~/Documents/projects/homestead-v2
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

### If `npm install` fails (auth / registry errors)

Your global npm config may be misconfigured. Use the project registry and bypass broken auth:

```bash
cd ~/Documents/projects/homestead-v2
npm install --registry=https://registry.npmjs.org/ --userconfig=/dev/null
```

Or fix npm once:

```bash
npm config fix
```

The project already includes `.npmrc` pointing at the public npm registry.

## Using the app

1. **View as Portal User** (default) — search properties, click **View Details**, submit the contact form (simulated).
2. **View as Admin** — fill in the form to add a listing; use **Delete** in the table to remove one.
3. The badge in the header shows **Mock data** or **Supabase** depending on configuration.

## Connect Supabase (optional)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open **SQL Editor** and run the full contents of:

   `supabase/schema.sql`

3. Copy env template and add your keys (Project Settings → API):

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_GROQ_API_KEY=your-groq-api-key
   ```

4. Restart the dev server:

   ```bash
   npm run dev
   ```

## Production build

```bash
npm run build
npm start
```

## Deploy (free)

Deploy to [Vercel](https://vercel.com):

1. Push this folder to GitHub.
2. Import the repo in Vercel.
3. Add the same `NEXT_PUBLIC_SUPABASE_*` env vars in project settings (optional).

## Project structure

```
src/
  app/              # Next.js App Router (page + layout)
  components/       # AdminDashboard, PortalView, PropertyModal
  data/             # Mock listings seed data
  lib/              # Supabase client + helpers
  types/            # TypeScript types
supabase/
  schema.sql        # Database setup for Supabase
```
