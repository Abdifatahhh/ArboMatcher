# Deploy ArboMatcher 0.25 naar www.arbomatcher.nl

## 1. Lokaal bouwen

```bash
cd "ArboMatcher 0.25"
npm ci
npm run build
```

Controleer dat `dist/` wordt aangemaakt. Test lokaal: `npm run preview`.

## 2. Omgevingsvariabelen (productie)

Zet bij je hosting de volgende **build-time** variabelen:

| Variabele | Waarde | Opmerking |
|-----------|--------|-----------|
| `VITE_SUPABASE_URL` | `https://apizxgqpdledjutgitpw.supabase.co` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | *(anon key uit Dashboard)* | Settings → API → anon public |

Geen andere env vars nodig voor de frontend.

## 3. Supabase: redirect-URL’s voor www en portal

In **Supabase Dashboard** → jouw project → **Authentication** → **URL Configuration**:

- **Site URL:** `https://portal.arbomatcher.nl` (of `https://www.arbomatcher.nl` als alles op één domein draait)
- **Redirect URLs** (één per regel, alle toestaan):
  - `https://www.arbomatcher.nl/**`
  - `https://arbomatcher.nl/**`
  - `https://portal.arbomatcher.nl/**`
  - `https://www.arbomatcher.nl`
  - `https://arbomatcher.nl`
  - `https://portal.arbomatcher.nl`

Opslaan. Anders werken inloggen, registratie en e-mailverificatie niet.

**Portal (portal.arbomatcher.nl):** Zelfde build als www; stel op de portal-site dezelfde env vars in (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Zonder deze vars toont de app een duidelijke fout i.p.v. een wit scherm. Zet ook SPA-rewrite: `/*` → `/index.html` (status 200).

## 4. Deploy op Netlify

1. **Site toevoegen:** Repo koppelen (GitHub/GitLab) of drag-and-drop van de `dist/` map.
2. **Build-instellingen** (vaak al uit `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment variables:** In Site settings → Environment variables toevoegen:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Custom domain:** Domain settings → Add custom domain → `www.arbomatcher.nl`. DNS bij je provider: CNAME `www` naar de Netlify-hostnaam (bijv. `xxx.netlify.app`). Optioneel: redirect `arbomatcher.nl` → `https://www.arbomatcher.nl`.
5. **Deploy:** Bij Git: push naar main; bij handmatige upload: `dist/` uploaden.

## 5. Deploy op Vercel (alternatief)

1. Import project, koppel repo.
2. Build: Build Command `npm run build`, Output Directory `dist`.
3. Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
4. Custom domain: `www.arbomatcher.nl` toevoegen in Project Settings → Domains.
5. Voor SPA-routing: in project root `vercel.json` toevoegen:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

## 6. Database (migrations)

Zorg dat alle migrations op je Supabase-project zijn uitgevoerd (o.a. `20260306170000_handle_new_user_profile_trigger.sql` voor registratie met e-mailverificatie):

```bash
npx supabase db push
```

Of voer de SQL uit de map `supabase/migrations/` handmatig uit in de SQL Editor.

## 7. Na deploy testen

- [ ] Homepage: https://www.arbomatcher.nl
- [ ] Registreren (e-mailverificatie)
- [ ] Inloggen
- [ ] Wachtwoord vergeten (link in mail moet naar www.arbomatcher.nl gaan)
- [ ] Arts- en opdrachtgeverflows

## 8. Versie

Deze instructies horen bij **ArboMatcher 0.25.0** (package.json `version`).
