# Beide sites instellen: Netlify, Namecheap, Supabase

Marketing = **arbomatcher.nl** | Portal = **portal.arbomatcher.nl**

**Let op:** Alleen jij kunt inloggen op Netlify, Namecheap en Supabase. De stappen hieronder moet je zelf in de browser uitvoeren. Hieronder staan alle waarden klaar om te kopiëren.

---

## Copy-paste waarden

**Supabase URL** (voor Netlify env var `VITE_SUPABASE_URL`):
```
https://apizxgqpdledjutgitpw.supabase.co
```

**Supabase Site URL** (in Supabase → Authentication → URL Configuration):
```
https://portal.arbomatcher.nl
```

**Redirect URLs** (in Supabase, één per regel in het Redirect URLs-veld):
```
https://portal.arbomatcher.nl
https://portal.arbomatcher.nl/**
https://arbomatcher.nl
https://arbomatcher.nl/**
https://www.arbomatcher.nl
https://www.arbomatcher.nl/**
```

**Netlify – beide sites:**  
De `netlify.toml` in de repo gebruikt één build voor beide: `npm run build` en `dist`. Laat de Build/Publish-instellingen in de Netlify UI leeg of gelijk aan de toml (command: `npm run build`, publish: `dist`). Beide sites deployen dan dezelfde build; de app kiest op basis van hostnaam (arbomatcher.nl vs portal.arbomatcher.nl).

**Namecheap – A-record voor arbomatcher.nl:**  
Type: A Record | Host: @ | Value: `75.2.60.5` | TTL: Automatic

**Namecheap – CNAME voor portal:**  
Type: CNAME | Host: `portal` | Value: `[jouw-portal-site].netlify.app` (uit Netlify Domain settings)

---

## 1. Supabase (eerst, voor keys en redirects)

1. Ga naar [supabase.com](https://supabase.com) → jouw project → **Authentication** → **URL Configuration**.

2. **Site URL** zetten op:
   ```text
   https://portal.arbomatcher.nl
   ```

3. **Redirect URLs** – deze allemaal toevoegen (één per regel):
   ```text
   https://portal.arbomatcher.nl
   https://portal.arbomatcher.nl/**
   https://arbomatcher.nl
   https://arbomatcher.nl/**
   https://www.arbomatcher.nl
   https://www.arbomatcher.nl/**
   ```

4. **Save**.

5. **Anon key** kopiëren voor Netlify: **Project Settings** (tandwiel) → **API** → onder **Project API keys** de **anon public** key kopiëren. Bewaar ook de **Project URL** (bijv. `https://apizxgqpdledjutgitpw.supabase.co`).

---

## 2. Netlify – twee sites (zelfde repo)

### Site 1: Marketing (arbomatcher.nl)

1. **Site toevoegen** → Repository koppelen (zelfde repo als portal).
2. **Build settings:** worden uit `netlify.toml` gehaald (`npm run build`, `dist`). Niets aanpassen tenzij je expliciet wilt overschrijven.
3. **Environment variables** (optioneel voor alleen marketing):
   - `VITE_SUPABASE_URL` = `https://apizxgqpdledjutgitpw.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = *(anon key uit Supabase)*
4. **Domain management** → **Add custom domain** → `arbomatcher.nl` invoeren.  
   Netlify toont wat je bij DNS moet zetten (zie stap 3).
5. Optioneel: ook `www.arbomatcher.nl` toevoegen en laten redirecten naar `arbomatcher.nl`.

### Site 2: Portal (portal.arbomatcher.nl)

1. **Add new site** → **Import an existing project** → dezelfde repo kiezen (of duplicate site).
2. **Build settings:** uit `netlify.toml` (`npm run build`, `dist`).
3. **Environment variables** (verplicht voor portal, anders wit scherm):
   - `VITE_SUPABASE_URL` = `https://apizxgqpdledjutgitpw.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = *(zelfde anon key)*
4. **Domain management** → **Add custom domain** → `portal.arbomatcher.nl` invoeren.

Na het instellen van DNS (stap 3) in Netlify bij beide domeinen op **Verify** / **Check DNS** klikken tot het groen is.

---

## 3. Namecheap – DNS

1. Inloggen op [namecheap.com](https://www.namecheap.com) → **Domain List** → domein **arbomatcher.nl** → **Manage**.
2. Tab **Advanced DNS**.

### Voor arbomatcher.nl (marketing)

- **A-record** (root domein):
  - Type: **A Record**
  - Host: **@**
  - Value: **75.2.60.5** (Netlify LB; of de IP die Netlify bij “Verify” toont)
  - TTL: Automatic
- **CNAME voor www** (als je www wilt):
  - Type: **CNAME**
  - Host: **www**
  - Value: **(jouw marketing-site).netlify.app** (zonder https://)
  - TTL: Automatic

### Voor portal.arbomatcher.nl (portal)

- **CNAME** (subdomein portal):
  - Type: **CNAME**
  - Host: **portal**
  - Value: **(jouw portal-site).netlify.app** (bijv. `xyz.netlify.app`, zonder https://)
  - TTL: Automatic

3. **Save**. Wijzigingen kunnen 5–30 min duren.
4. Controleren: [dnschecker.org](https://dnschecker.org) voor `arbomatcher.nl` en `portal.arbomatcher.nl`.

---

## 4. Controlelijst

| Waar      | Marketing (arbomatcher.nl)     | Portal (portal.arbomatcher.nl)   |
|----------|---------------------------------|-----------------------------------|
| **Netlify Build/Publish** | Uit netlify.toml: `npm run build`, `dist` (voor beide) | Idem |
| **Netlify env** | Optioneel                       | Verplicht: VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY |
| **Namecheap** | A @ → 75.2.60.5 (of Netlify-IP) | CNAME portal → *.netlify.app      |
| **Supabase** | Redirect URLs voor beide domeinen staan in de lijst (stap 1) | Site URL = portal.arbomatcher.nl |

---

## 5. Na eerste deploy

- **arbomatcher.nl** → marketingpagina’s; knoppen Inloggen/Registreren gaan naar portal.arbomatcher.nl.
- **portal.arbomatcher.nl** → login, registratie, dashboard; zelfde app, andere host.
- Bij wijzigingen: push naar repo → beide Netlify-sites bouwen automatisch (als ze aan dezelfde repo hangen).
