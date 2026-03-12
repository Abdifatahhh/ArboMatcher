# Senior developer review – ArboMatcher

Review uitgevoerd in lijn met de bestaande codebase: stack (React, Vite, Supabase), naamgeving, componentstructuur en Nederlandse UI.

---

## 1. Algemene beoordeling

**Wat al goed staat**
- Duidelijke scheiding portal/marketing via `isPortal()` en `config/portal.ts`; lokaal in dev als portal.
- Auth-flow is rond: AuthContext, getOrCreateProfile, ProtectedRoute, rol- en onboarding-redirects.
- Lazy loading van pagina’s via `lazyPages.ts`; preload voor marketing-routes.
- Consistente Supabase-import (`lib/supabase`), types in `lib/types.ts`, RLS in migraties.
- Opdrachtgever-onboarding met KvK-zoeken via Edge Function (geen key in frontend).
- Admin heeft aparte services (adminJobsService, adminUsersService, etc.) en duidelijke lijsten/filters.
- Empty states zijn op veel plekken aanwezig (“Geen opdrachten gevonden”, “Geen kandidaten”, etc.).
- Formulieren gebruiken overal `setError` + lokale state; Register heeft cooldown en e-mail-check.

**Grootste problemen**
- Publieke opdrachtenpagina (`Opdrachten.tsx`) mengt echte jobs met `fakeJobs` uit `data/fakeJobs.ts`; in productie horen geen fake jobs in de lijst.
- Arts-abonnement (“PRO”) is alleen een DB-toggle (`professionals.doctor_plan`); geen betalings- of abonnementsflow.
- Admin-dashboard toont demo-stats en demo-activity zodra de DB “leeg” is (`isEmpty`); demo-data kan verwarren als er wel echte data is maar tellers tijdelijk 0 zijn.

**Grootste risico’s**
- Fake jobs op de live opdrachtenpagina (verkeerde verwachting, mogelijk verkeerde links/ids).
- Geen echte abonnements-/betalingslogica terwijl de UI wel over PRO/abonnementen praat.
- Afhankelijkheid van Edge Functions (kvk-search, big-check) en secrets; als die ontbreken, stille of onduidelijke fouten.

**Eerst aanpakken**
1. Fake jobs uitsluiten van de publieke opdrachtenlijst (of alleen in dev).
2. Duidelijk maken in code/UX dat PRO/abonnement nog “coming soon” is, of een minimale abonnementslogica koppelen.
3. Admin demo-mode alleen tonen wanneer bewust gekozen (bijv. feature flag of aparte dev-build), niet automatisch bij “lege” tellers.

---

## 2. Bevindingen per onderdeel

### Homepage / Marketing
- **Goed:** Home, Over, Opdrachten, Prijzen, Contact, FAQ, Community, Privacy, Terms; PublicLayout met nav en AuthLink.
- **Niet goed:** Opdrachten-pagina voegt `fakeJobs` toe aan echte jobs; filters en paginering werken over de gecombineerde lijst. Gebruiker ziet niet wat echt of fake is.
- **Impact:** Hoog. **Type:** Data / UX.

### Auth (login, register, wachtwoord vergeten)
- **Goed:** Login met categorisatie fouten, redirect na rol/onboarding; Register met e-mail beschikbaarheid (RPC), privacy/terms, cooldown; “Al ingelogd”-banner op portal voorkomt verrassende redirect naar onboarding.
- **Niet goed:** Geen rate limiting in de frontend naast cooldown; wachtwoordsterkte alleen “minimaal 8 tekens”.
- **Impact:** Middel (security/UX). **Type:** Security / UX.

### Onboarding
- **Goed:** Rolkeuze, professional (BIG/zoeken, RCM), opdrachtgever (KvK-zoek, bedrijf kiezen, geen cookiebanner), opslaan profiles/employers/professionals; debounce KvK-zoek vanaf 3 tekens.
- **Niet goed:** Bij geen KvK-resultaten geen fout meer (alleen lege lijst); handmatig invullen zonder KvK mogelijk maar flow is vooral op “zoek en kies” ingericht.
- **Impact:** Laag. **Type:** UX.

### Professional (arts) dashboard en pagina’s
- **Goed:** Dashboard met tellingen, links naar opdrachten/profiel/abonnement; ArtsDashboardLayout met duidelijke nav; Opdrachten toont alleen PUBLISHED; Reacties, Uitnodigingen, Favorieten, Inbox met empty states.
- **Niet goed:** Abonnement-pagina zet alleen `doctor_plan` in DB; geen betaling, geen koppeling met `subscriptions`-tabel; PRO vs GRATIS wordt in OpdrachtDetail/Opdrachten wel gebruikt (o.a. zichtbaarheid 48u) maar de “upgrade” is gratis.
- **Impact:** Hoog voor productie. **Type:** Functionaliteit / data.

### Opdrachtgever dashboard en pagina’s
- **Goed:** Dashboard met employer, job- en application-counts; Profiel met contact + bedrijfsgegevens + extra KvK-velden; Opdrachten CRUD met DRAFT/PUBLISHED; Kandidaten, Favorieten, Inbox, Abonnement in nav.
- **Niet goed:** Geen controle op abonnement/limiet bij aanmaken opdracht; opdrachtgever-abonnementpagina niet geïmplementeerd (alleen route).
- **Impact:** Middel. **Type:** Functionaliteit / businesslogica.

### Opdrachten (publiek) en OpdrachtDetail
- **Goed:** Filters (expertise, locatie, contractvorm), zoekterm, sortering, paginering; detail met reageren en favoriet; alleen PUBLISHED.
- **Niet goed:** `fakeJobs` in dezelfde lijst als echte jobs; fake ids (bijv. `fake-1`) kunnen tot 404 of verkeerde detailpagina leiden als iemand een fake job opent.
- **Impact:** Hoog. **Type:** Data / functionaliteit.

### Admin
- **Goed:** Dashboard met echte stats; lege DB → demo-stats/activity; Verificaties, Gebruikers, Artsen, Opdrachtgevers, Opdrachten, Reacties, Jobs Review, Abonnementen, Instellingen, Community; services per domein; SubscriptionsTable link naar `/admin/gebruikers/${subscription.user_id}` (profiel-id).
- **Niet goed:** Demo-mode bij “lege” tellers (alle users/doctors/jobs/apps = 0) kan verwarrend zijn; geen duidelijke “Demo”-badge op alle demo-data; GebruikerDetail gebruikt mogelijk demo-opdrachtgevers in sommige flows (adminDemoData).
- **Impact:** Middel. **Type:** UX / consistentie.

### Supabase / database
- **Goed:** Eén client, validateSupabaseEnv, checkDatabaseHealth; RLS in migraties voor profiles, employers, professionals, jobs, applications, invites, favorites, conversations, messages, subscriptions, content_store, job_review_history, job_admin_notes.
- **Niet goed:** Health check faalt bij “Failed to fetch” (vaak env/URL); geen expliciete foutafhandeling bij RLS-denial in alle componenten (sommige tonen alleen generieke fout).
- **Impact:** Middel. **Type:** Technisch / security.

### Edge Functions
- **Goed:** kvk-search (Zoeken + Basisprofiel, key alleen server-side), big-check; deploy met --no-verify-jwt voor kvk-search gedocumenteerd.
- **Niet goed:** Geen fallback als KvK niet bereikbaar is (wel duidelijke foutmelding); BIG-check afhankelijk van externe service.
- **Impact:** Laag. **Type:** Technisch.

---

## 3. Functionele problemen

- **Opdrachtenpagina toont fake jobs:** Echte en fake jobs worden samengevoegd; fake jobs hebben eigen ids. Impact: verkeerde verwachting, mogelijke broken links. Oplossing: fake jobs alleen in dev of aparte “demo”-modus, of verwijderen.
- **PRO-abonnement zonder betaling:** Arts kan “PRO” kiezen zonder betaling; alleen DB-update. Geen koppeling met `subscriptions` of betalingsprovider. Oplossing: of duidelijke “Binnenkort”/placeholder, of echte abonnements- en betalingsflow.
- **Opdrachtgever kan onbeperkt opdrachten plaatsen:** Geen check op abonnement of limiet bij aanmaken/plaatsen opdracht. Oplossing: businessregel (limiet per plan) en/of abonnementscheck.
- **Admin demo bij “lege” DB:** Bij 0 users, 0 doctors, 0 jobs, 0 applications worden demo-stats en demo-activity getoond. Eerste echte gebruiker ziet dan opeens echte cijfers; verwarring. Oplossing: aparte “Demo”-modus of geen demo-stats op basis van tellers.
- **Geen globale rate limiting op login/registratie:** Alleen cooldown op Register; Login niet. Oplossing: rate limiting (bijv. Supabase of Edge Function) of duidelijke “Te veel pogingen”-melding.
- **Wachtwoordvergeten-flow:** Flow en e-mailtemplate bestaan; controleer of redirect-URL en e-mailverificatie in productie kloppen (Site URL, redirect URLs in Supabase).
- **48-uursregel PRO vs GRATIS:** In code/FAQ wordt gesproken over “48 uur” voor gratis-artsen; controleer of job-listing en -detail deze logica consistent toepassen (bijv. `created_at` vs `doctor_plan`).

---

## 4. Technische problemen

- **Dubbele/verschillende type-definities:** `SubscriptionPlan` / `SubscriptionStatus` in zowel `lib/types.ts` als `services/adminSubscriptionsService.ts`; arts-pagina’s casten `doctor_plan` met `(doctor as { doctor_plan?: string })`. Oplossing: één bron voor plan-types (bijv. lib/types) en overal daarvan importeren.
- **Geen gedeelde form-validatie:** Validatie zit per form (Register, Onboarding, Contact, etc.); geen gedeelde helpers of schema’s (bijv. Zod) voor e-mail, telefoon, KvK. Oplossing: kleine validatie-utils of schemas hergebruiken.
- **Zware Admin-pagina’s:** Admin Dashboard en lijstpagina’s doen meerdere queries in één effect; geen paginering op DB-niveau in alle lijsten. Oplossing: waar nodig `.range()` of cursor-based paginering en lazy load van tabellen.
- **Suspense fallback null:** In App.tsx is `<Suspense fallback={null}>`; bij trage lazy load is er geen loading-indicator. Oplossing: fallback met kleine spinner of skeleton.
- **Health check blokkeert init:** Bij ontbrekende env of falende health wordt loading pas na timeout (12s) of na health-resultaat false; gebruiker ziet dan mogelijk lang niets of alleen login. Oplossing: health niet blokkerend maken voor tonen login, of kortere timeout.
- **Foutafhandeling na Supabase-call:** Veel `if (error) setError(error.message)` zonder categorisatie; auth-utils categoriseren wel. Oplossing: op kritieke plekken (opdracht plaatsen, profiel opslaan) categorisatie of duidelijke gebruikersmelding.
- **Placeholder-teksten in code:** Enkele placeholders (bijv. telefoon 013-1234567 in PublicLayout). Oplossing: vervangen door echte contactgegevens of config.

---

## 5. UX / UI-problemen

- **Inconsistente loading-spinners:** De ene pagina gebruikt `Loader2` met `animate-spin`, de andere alleen “Laden...” of “Bezig...”; kleur en grootte wisselen. Oplossing: één kleine set loading-componenten (bijv. `PageLoader`, `ButtonLoader`).
- **CTA-hiërarchie op dashboard:** Meerdere groene knoppen naast elkaar; niet overal duidelijk wat de primaire actie is. Oplossing: één duidelijke primaire CTA per blok, secundair in outline/stroke.
- **Mobile navigatie:** Arts- en opdrachtgever-dashboards hebben bottom sheet / mobiele nav; controleren of alle links bereikbaar zijn en of touch-targets groot genoeg zijn.
- **Formulierlabels en -fouten:** Niet overal staat foutmelding direct onder het veld; soms alleen bovenaan. Oplossing: waar mogelijk fout per veld tonen (bijv. onder input).
- **“Al ingelogd”-banner:** Duidelijke tekst en knoppen; kan iets compacter op mobile.
- **Cookiebanner alleen op marketing:** Correct; portal toont geen cookiebanner. Geen wijziging nodig.
- **Taal:** Mix van “u” en “je” in teksten (Register/Login vs dashboard). Oplossing: één aanspreekvorm kiezen (bijv. “je” in portal, “u” op marketing) en doorvoeren.

---

## 6. Wat ontbreekt nog?

- **Betalings- en abonnementsintegratie:** Geen Stripe/Mollie/anders; PRO en opdrachtgever-abonnement zijn niet gekoppeld aan betaling of `subscriptions`.
- **E-mailverificatie na registratie:** Flow en template bestaan; controleren of in productie e-mails aankomen en links kloppen.
- **Echte limieten voor opdrachten/reacties:** Geen limiet op aantal opdrachten per opdrachtgever of reacties per arts; alleen `doctor_plan` voor zichtbaarheid.
- **Notificaties:** Geen in-app of push-notificaties voor nieuwe reacties, uitnodigingen, berichten.
- **Zoek-/filter-persistentie:** Filters op Opdrachten (publiek) en admin-lijsten niet in URL; bij verversen gaat state verloren. Query params zouden filters kunnen dragen.
- **Toegankelijkheid:** Geen systematische focus management, aria-labels of screen-reader checks.
- **Analytics/monitoring:** Geen integratie voor errors (bijv. Sentry) of basis analytics.

---

## 7. Verbeterplan in fases

### Fase 1 – Kritiek

| # | Wat | Waarom | Urgentie | Impact |
|---|-----|--------|----------|--------|
| 1 | Fake jobs uitschakelen op publieke Opdrachten (of alleen in dev) | Echte gebruikers mogen geen fake opdrachten zien; risico op broken links en verwarring. | Hoog | Hoog |
| 2 | PRO/abonnement duiden als “nog niet actief” of minimale abonnementslogica | UI belooft PRO/abonnement; nu is het een gratis toggle. Misleidend of verwarrend. | Hoog | Hoog |
| 3 | Admin demo-mode niet automatisch bij lege tellers | Voorkomt verwarring wanneer DB net leeg is of net gestart. | Middel | Middel |
| 4 | Controleren wachtwoordvergeten- en verificatie-e-mails in productie | Anders kunnen gebruikers niet verifiëren of wachtwoord resetten. | Hoog | Hoog |

### Fase 2 – Belangrijke verbeteringen

| # | Wat | Waarom | Urgentie | Impact |
|---|-----|--------|----------|--------|
| 5 | Abonnements-/plancheck bij opdracht plaatsen (opdrachtgever) | Voorkom onbeperkt plaatsen zonder businessregel. | Middel | Middel |
| 6 | Eén loading-component en consistente “Bezig…”/“Laden…” | Betere UX en visuele consistentie. | Laag | Middel |
| 7 | Formulierfouten per veld waar mogelijk | Snellere feedback en minder zoeken. | Laag | Middel |
| 8 | Filterstate in URL (opdrachten, admin-lijsten) | Filters blijven bij verversen en zijn deelbaar. | Laag | Middel |
| 9 | Eén aanspreekvorm (u/je) en doorvoeren in copy | Professionele uitstraling en consistentie. | Laag | Laag |

### Fase 3 – Technische opschoning

| # | Wat | Waarom | Urgentie | Impact |
|---|-----|--------|----------|--------|
| 10 | Eén bron voor Subscription/Plan-types | Minder dubbel werk en type-fouten. | Laag | Laag |
| 11 | Gedeelde validatie-utils of schemas | Minder dubbele validatielogica. | Laag | Laag |
| 12 | Admin-lijsten: server-side paginering waar nodig | Minder geheugen en snellere eerste load. | Laag | Middel |
| 13 | Supabase-fout categoriseren op kritieke acties | Betere foutmeldingen voor gebruiker. | Laag | Laag |
| 14 | Suspense fallback met spinner/skeleton | Geen lege flash bij trage lazy load. | Laag | Laag |

### Fase 4 – Polishing

| # | Wat | Waarom | Urgentie | Impact |
|---|-----|--------|----------|--------|
| 15 | Placeholder-telefoon/contact vervangen door config of echte gegevens | Geen dummy-tekst in productie. | Laag | Laag |
| 16 | Eenvoudige error reporting (bijv. Sentry) | Sneller fouten in productie zien. | Laag | Middel |
| 17 | Basis toegankelijkheid (focus, aria, contrast) | Inclusiever en toekomstbestendig. | Laag | Laag |

---

## 8. Direct uitvoerbare taken

- [ ] **Opdrachten.tsx:** `fakeJobs` niet meer mergen in de lijst die naar de UI gaat; of alleen mergen als `import.meta.env.DEV` (of feature flag). Echte jobs blijven ongewijzigd.
- [ ] **Arts/Abonnement.tsx:** Tekst toevoegen dat PRO “binnenkort beschikbaar” is of dat betaling nog niet actief is; of knop “Upgrade” uitschakelen met tooltip.
- [ ] **Admin/Dashboard.tsx:** Demo-stats/activity alleen tonen als expliciete demo-mode (bijv. query `?demo=1` of env); anders bij lege tellers “Nog geen gegevens” tonen.
- [ ] **App.tsx:** `<Suspense fallback={...}>` vervangen door een kleine full-screen spinner (zelfde stijl als ProtectedRoute).
- [ ] **lib/types.ts of adminSubscriptionsService:** SubscriptionPlan/Status alleen in types exporteren; admin-components en Arts/Abonnement daarop importeren.
- [ ] **Register/Login:** Controleren of alle foutmeldingen in het Nederlands zijn en of “u”/“je” consistent is met de rest van de portal.
- [ ] **Opdrachtgever/Opdrachten:** Bij “Plaats opdracht” of “Publiceren” een comment of placeholder toevoegen voor toekomstige abonnementscheck (geen echte blokkade zonder productiebeslissing).
- [ ] **PublicLayout:** Placeholder-telefoonnummer vervangen door variabele uit config of env (bijv. `VITE_CONTACT_PHONE`).
- [ ] **Health check (health.ts):** Bij `!searchRes.ok` of catch de bestaande gebruikersvriendelijke error behouden; controleren of EnvBanner en Login dezelfde boodschap tonen.
- [ ] **Documentatie:** In README of docs kort noteren: PRO/opdrachtgever-abonnement nog zonder betaling; fake jobs alleen in dev (na aanpassing punt 1).

---

*Review afgerond; uitgangspunt was de bestaande architectuur, stack en naamgeving van ArboMatcher.*
