# AGENTS.md

## Commands
- `npm run dev` – start Next.js dev server on port 3000
- `npm run build` – production build (lint errors do **not** block builds)
- `npm run lint` – eslint (ESLint 9 flat config with `next/core-web-vitals` + `next/typescript`)

There is **no test framework** configured. There is no `typecheck` script — TypeScript errors are surfaced by `next build` or your editor.

## Environment
- Copy `.env.local` (gitignored) with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, and `YOUTUBE_API_KEY`.
- Supabase edge functions live in `supabase/functions/` and run on **Deno**, not Node. They are deployed separately.

## Architecture

```
src/
  app/                  # Next.js App Router
    (protected)/        # Auth-gated pages (home, build, games, videos, teammate, settings, aboutus, youtube)
    login/ register/    # Public auth pages
    auth/callback/      # Supabase OAuth callback
    api/                # API route handlers
  component/            # React components
  hooks/                # useTrans (i18n context: vi/en via localStorage)
  store/                # Static game data (Albion Online items, videos)
  types/                # Global type declarations (e.g. vanta.d.ts)
  utils/                # Utility hooks
  middleware.ts          # Protects routes — redirects to /login if no session
lib/
  supabase/
    client.ts           # Browser-side Supabase client
    server.ts           # Server-side Supabase client (for Route Handlers / SSR)
  database.types.ts     # Generated Supabase schema types
supabase/
  config.toml           # Supabase local dev & function config
  functions/            # Deno edge functions (delete-user-account, update-user-display-name)
```

- **`@/` maps to `./src/`** (tsconfig paths).
- `vercel.json` redirects `/` → `/login`.
- Deployed on Vercel.

## Key Gotchas
- **Protection is hardcoded**: `src/middleware.ts:37` lists protected routes in a plain array (`['/home', '/teammate', '/build', ...]`). If you add a new protected page, you **must** add it to that array — the matcher alone is not enough.
- **`eslint.ignoreDuringBuilds: true`** in `next.config.js` — `npm run build` skips lint. Run `npm run lint` separately to catch violations.
- **No typecheck script**. TS is checked during `next build` only. Use editor diagnostics or run a build to verify types.
- The `useTrans` hook reads `localStorage` on mount; it assumes `TransProvider` wraps the app. Import requires `'use client'`.
- Supabase has **two different client packages** in use: `@supabase/ssr` (middleware, server.ts, callback) and `@supabase/auth-helpers-nextjs` (api/login and api/logout route handlers). Be consistent when adding new server-side Supabase code — prefer `@supabase/ssr`.
- `api/login/route.ts` and `api/logout/route.ts` are currently identical (both call `signOut`). Likely a copy-paste issue in the login handler.
- Tailwind v4: config is via CSS `@import "tailwindcss"` (no `tailwind.config.js`).
- Ant Design 5 with `@ant-design/compatible` compat layer; the root layout imports `antd/dist/reset.css`.
- Both `moment` and `dayjs` are dependencies — `moment` is used in `useTrans`, `dayjs` may be unused.
- Game rendering libraries (pixi.js, phaser, three) are in `dependencies`; they are used on specific pages (e.g. games feature).

## Editing Conventions
- Prefer `use client` directives at the top of components that use hooks, browser APIs, or Ant Design.
- i18n strings: add them to `src/hooks/vi.ts` and `src/hooks/en.ts`; consume via `useTrans()`.
- Styles: Tailwind utility classes first, supplemented by CSS custom properties defined in `globals.css`.
