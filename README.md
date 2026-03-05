# ArboMatcher

Platform voor het verbinden van opdrachtgevers en arbo-professionals (bedrijfsartsen). Gebouwd met React, Vite, TypeScript en Supabase.

## Tech stack

- **Frontend:** React 18, Vite 5, TypeScript, React Router, Tailwind CSS
- **Backend / data:** Supabase (Auth, Postgres, Edge Functions)
- **Deploy:** Netlify (of vergelijkbare static host)

## Projectstructuur

```
src/
├── components/
│   ├── Admin/             # Admin-specifieke tabellen en filters
│   ├── Layout/            # PublicLayout, DashboardLayout, ArtsDashboardLayout
│   ├── auth/              # ProtectedRoute, RedirectByRole
│   └── ui/                # Logo en andere herbruikbare UI
├── context/               # AuthContext
├── data/                  # Demo- en fake data voor admin
├── lib/
│   ├── supabase/          # Client, health check (centrale Supabase-toegang)
│   ├── schemas/           # Schema-constanten (bijv. admin clients)
│   └── types.ts           # Gedeelde TypeScript-types
├── pages/                 # Pagina’s per gebied (Admin, Arts, Opdrachtgever, public)
├── services/              # API-/Supabase-services (admin, bigCheck)
└── utils/                 # Pure helpers (auth, etc.)
```

## Ontwikkeling

### Vereisten

- Node.js 18+
- npm of yarn

### Installatie

```bash
npm install
cp .env.example .env
```

Vul in `.env` je Supabase-projectgegevens in (Dashboard → Settings → API).

### Lokaal draaien

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview   # preview van production build
```

### Supabase Edge Functions (BIG-check)

Zie `docs/DEPLOY-BIG-CHECK.md` voor het deployen van de `big-check` Edge Function.

## Rollen

- **ARTS** – artsen/dashboard onder `/arts/*`
- **OPDRACHTGEVER** – opdrachtgevers/dashboard onder `/opdrachtgever/*`
- **ADMIN** – beheer onder `/admin/*`

## Documentatie

- `docs/ADMIN-TEST-ACCOUNT.md` – test-adminaccount en demo-data
- `docs/DEPLOY-BIG-CHECK.md` – BIG-check Edge Function deployen

## Versiebeheer & GitHub

Zie **[GITHUB-SETUP.md](GITHUB-SETUP.md)** voor stappen om Git te installeren, de repo te initialiseren en naar GitHub te pushen.

## Licentie

Proprietary – alle rechten voorbehouden.
