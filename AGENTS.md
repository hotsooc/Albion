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
  utils/                # Utility functions (youtube.ts — YouTube URL/id helpers)
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
- **Two Supabase client packages** in use: `@supabase/ssr` (middleware, server.ts, callback) and `@supabase/auth-helpers-nextjs` (unused but still in deps). Always prefer `@supabase/ssr`.
- **Theming**: Uses `next-themes` with `data-theme` attribute strategy. Two themes (light/dark) controlled by CSS custom properties in `globals.css:3-42`. Toggle button is in `ClientHeader` via `useTheme()`. Ant Design is synced via `AntdProvider` using `darkAlgorithm`/`defaultAlgorithm`.
  - **Hardcoded colors are banned** — always use `var(--token-name)` or `dark:` prefix for Tailwind classes. See `globals.css` for all available tokens.
  - `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))` enables `dark:` prefix in Tailwind.
- Use `theme-transition` class on container elements for smooth color transitions during theme switch.
- Use `will-change-transform backface-visibility-hidden` on interactive elements with hover/click animations for GPU-accelerated rendering.
- `youtube.ts` utility has `getYouTubeVideoId()` and `getYouTubeThumbnail()` — use these, don't inline YouTube regex.
- **Icons**: Use `lucide-react` for UI icons (`Home`, `Users`, `Film`, `Wrench`, `User`, `Settings`, `LogOut`, `ChevronLeft`, `ChevronRight`, `Pencil`, `Plus`, `ArrowLeft`, `MessageSquare`, `ChevronDown`, `Sun`, `Moon`). They auto-adapt to theme via `currentColor`. Add `className="text-[var(--text-primary)]"` for theme support.
- **Loading states**: Use the `Skeleton` component (`CardSkeleton`, `GridSkeleton`, `ListSkeleton`) instead of raw `<Spin>` or plain `<div>`.
- **Mobile**: Sidebar uses overlay mode on `<768px` with hamburger toggle. Header search collapses to icon on mobile. Language switcher hides text on mobile.
- Ant Design 5 with `@ant-design/compatible` compat layer; the root layout imports `antd/dist/reset.css`.
- Both `moment` and `dayjs` are dependencies — `moment` is used in `useTrans`, `dayjs` may be unused.
- Game rendering libraries (pixi.js, phaser, three) are in `dependencies`; they are used on specific pages (e.g. games feature).

## Editing Conventions
- Prefer `use client` directives at the top of components that use hooks, browser APIs, or Ant Design.
- i18n strings: add them to `src/hooks/vi.ts` and `src/hooks/en.ts`; consume via `useTrans()`.
- Styles: Tailwind utility classes first, supplemented by CSS custom properties defined in `globals.css`.
