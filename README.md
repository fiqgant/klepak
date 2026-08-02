# Klepak — Digital Signage

Klepak is a two-page digital signage app:

- **`/display`** — public, full-screen, meant to run in an old Android TV
  box's browser in kiosk mode. Right-hand sidebar (split-flap clock,
  today's announcements, today's schedule) + a crossfade slideshow of
  posters/QR links (and optional video).
- **`/admin`** — protected, meant to be used from a phone. One section per
  content type, plus a prominent emergency-override switch.

Every piece of content has a lifecycle (`starts_at` / `ends_at`), so
outdated posters and announcements disappear on their own — nobody has to
remember to deactivate anything.

## Stack

Next.js 14 (App Router, TypeScript) · Supabase (Postgres, Auth, Storage,
Realtime) · Tailwind CSS · deployed to Vercel.

## 1. Run the SQL schema

1. Create a Supabase project.
2. Open **SQL Editor** in the Supabase dashboard.
3. Paste the contents of [`supabase/schema.sql`](./supabase/schema.sql) and
   run it.

This creates all six content tables (`announcements`, `posters`,
`schedule_items`, `qr_links`, `videos`, `emergency_override`) plus a
singleton `settings` table, enables Row Level Security on every table
(public/anon read is restricted to rows that are `is_active = true` and
currently inside their `starts_at`/`ends_at` window; all writes require the
`authenticated` role), enables Realtime on the six content tables, and — as
part of the same script — creates the `signage-images` Storage bucket and
its policies.

If you'd rather create the bucket by hand instead of via SQL, see step 2.

## 2. Create the `signage-images` Storage bucket

The schema script already creates this bucket. If you skipped that part or
want to do it manually instead:

1. In the Supabase dashboard, go to **Storage** → **New bucket**.
2. Name it exactly `signage-images`.
3. Mark it **Public**.
4. Add policies allowing `anon` to `SELECT` and `authenticated` to
   `INSERT`/`UPDATE`/`DELETE` on objects in that bucket (already included in
   `schema.sql` if you ran it in full).

## 3. Create the one admin user

Klepak has no public sign-up flow — there's a single admin account you
create by hand:

1. In the Supabase dashboard, go to **Authentication** → **Users** → **Add
   user**.
2. Enter an email and password, and confirm the user (or disable "Confirm
   email" in Auth settings for local testing).
3. This is the only account that can sign in at `/admin/login` and write to
   any table — enforced by the RLS policies in `schema.sql`, not just by
   hiding UI elements.

## 4. Fill in `.env.local`

```bash
cp .env.example .env.local
```

Then fill in, from **Project Settings → API** in the Supabase dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Only these two variables are used, and both are safe to expose to the
browser — the anon key only grants what the RLS policies allow. **Never**
put the service role key in a `NEXT_PUBLIC_*` variable or anywhere in
client-side code.

## 5. Run it

```bash
npm install
npm run dev
```

- `http://localhost:3000/display` — the signage screen.
- `http://localhost:3000/admin` — redirects to `/admin/login` until you sign
  in with the account from step 3.

## 6. Deploy to Vercel

1. Push this repo to GitHub (or your Git provider of choice).
2. In Vercel, **Import Project** and select the repo.
3. Add the two environment variables from step 4 in the Vercel project's
   **Settings → Environment Variables**.
4. Deploy. Point the Android TV box's browser at
   `https://your-app.vercel.app/display` in kiosk mode.

## Project structure

```
app/
  display/page.tsx        public signage screen
  admin/page.tsx           admin dashboard (protected)
  admin/login/page.tsx      admin login
components/
  display/                 clock, sidebar, slideshow, slide types, overlays
  admin/                   one *Section.tsx per content type + shared bits
lib/
  supabase.ts               browser Supabase client
  supabase-server.ts        server/SSR Supabase client
  useAdminTable.ts           shared CRUD/reorder/realtime hook for admin lists
  date.ts                    Indonesian day/month names, date-window helpers
  types.ts                   row types for all tables
middleware.ts                redirects unauthenticated /admin/* to /admin/login
supabase/schema.sql          full schema: tables, RLS, Realtime, storage bucket
```

## Notes on the `/display` implementation

- Every content query is re-filtered against the current time on every
  render tick (not just once on load), so items disappear the instant they
  expire even if the screen has been on for hours.
- Realtime subscriptions on all six tables mean admin edits show up on
  screen within moments, with no reload.
- The clock/date avoid `Intl`/`toLocaleDateString` locale support and use
  hardcoded Indonesian day/month name arrays instead, since old Android
  STB browsers are inconsistent (or missing) locale data.
- The crossfade slideshow respects `prefers-reduced-motion` by disabling
  the fade transition.
- Empty/error states show a status message with automatic retry instead of
  a blank screen.

## Future ideas (not built)

- Sync `schedule_items` automatically from Google Calendar.
- Scope content per-location (e.g. a `location_id` column + admin picker)
  if more than one display is ever deployed.
