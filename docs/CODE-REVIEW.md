# Code review – ArboMatcher

Overzicht van wat er goed gaat en wat beter kan in de huidige codebase.

---

## ✅ Verbeteringen doorgevoerd (herstelronde)

- **fetchData-bug (Admin ArtsDetail):** Er is een `loadDoctor()`-functie toegevoegd en na save wordt `await loadDoctor()` aangeroepen.
- **Types:** `Doctor.subscription_type` en type `DoctorSubscriptionType` toegevoegd in `lib/types.ts`. Arts/Abonnement gebruikt dit type.
- **Toasts:** `ToastContext` en `ToastProvider` toegevoegd; `alert()` in OpdrachtDetail en Opdrachtgever/Opdrachten vervangen door `useToast().success()` / `useToast().error()`.
- **Code splitting:** Alle pagina’s worden lazy geladen met `React.lazy()`; `Suspense` met `PageLoader` rond de routes.
- **Error boundary:** `ErrorBoundary` component toegevoegd en in `main.tsx` rond de app gezet.
- **Path alias:** `@/` geconfigureerd in `vite.config.ts` en `tsconfig.app.json` (optioneel te gebruiken in imports).

---

## Wat er goed gaat

- **Centrale Supabase-client**: Eén client in `lib/supabase/client.ts`, hergebruik via `lib/supabase`; `supabaseClient.ts` is een duidelijke compatibility-export.
- **Auth & foutafhandeling**: `AuthContext` met health check, `categorizeAuthError` in `utils/auth.ts` en gebruikersvriendelijke foutmeldingen op Login.
- **Type-definities**: `lib/types.ts` met duidelijke interfaces en een `Database`-type voor Supabase.
- **Admin-services**: Gescheiden services per domein (artsen, jobs, clients, subscriptions, etc.) met paginering en filters.
- **Protected routes**: `ProtectedRoute` en `RedirectByRole` voor rolgebaseerde toegang.
- **Layouts**: Duidelijke scheiding tussen `PublicLayout`, `DashboardLayout` en `ArtsDashboardLayout`.
- **Tailwind**: Consistente kleuren (`#0F172A`, `#4FA151`) en utility-first styling.

---

## 1. Bugs / direct oplosbaar

### 1.1 `fetchData` bestaat niet in Admin ArtsDetail

In `src/pages/Admin/ArtsDetail.tsx` wordt na het opslaan `fetchData()` aangeroepen (rond regel 145), maar er is geen functie `fetchData` in die component. De data wordt alleen in een `useEffect` met `getDoctorById(id)` geladen.

**Aanbeveling:** Een `fetchData`-functie toevoegen die `getDoctorById(id)` aanroept en `setDoctor`/`setProfile` bijwerkt, en die na een succesvolle save aanroepen. Of de bestaande load-logica uit de `useEffect` in een benoemde functie zetten en die na save opnieuw aanroepen.

### 1.2 TypeScript-fouten (Supabase-typen)

Er zijn veel TS-fouten waarbij Supabase-typen als `never` uitvallen (o.a. `.insert()`, `.update()`, en property-toegang op query-resultaten). Vaak komt dat doordat de gegenereerde Supabase-typen niet (meer) in lijn zijn met het echte schema.

**Aanbeveling:**

- Supabase types opnieuw genereren: `npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts` en in `lib/supabase/client.ts` (en eventueel `lib/types.ts`) die types gebruiken.
- Controleren of `Database` in `lib/types.ts` alle tabellen en kolommen dekt die in de app worden gebruikt (o.a. `doctors.subscription_type` als die in de DB bestaat).

### 1.3 Ontbrekende velden in types

- `Doctor`: in o.a. `Arts/Abonnement.tsx` wordt `subscription_type` gebruikt; dat veld ontbreekt in `lib/types.ts` (Doctor-interface).
- `Subscription`: als de database een `subscription_type` (of vergelijkbaar) veld heeft, dit in de interface opnemen.

**Aanbeveling:** Database-schema en migraties naast de types leggen en ontbrekende velden toevoegen aan de juiste interfaces in `lib/types.ts`.

---

## 2. Structuur en onderhoud

### 2.1 App.tsx te groot

`App.tsx` bevat alle routes (60+ `Route`-componenten) en veel herhaalde patronen (`ProtectedRoute` + layout + pagina).

**Aanbeveling:**

- Routes splitsen per domein (public, arts, opdrachtgever, admin) in bestanden zoals `routes/public.tsx`, `routes/arts.tsx`, en die in `App.tsx` importeren.
- Eventueel een kleine route-helper of een route-config array gebruiken om duplicatie te verminderen.

### 2.2 Geen path-aliassen

Imports gebruiken relatief padden (`../../lib/supabase`, `../../context/AuthContext`).

**Aanbeveling:** In `vite.config.ts` en `tsconfig` path-aliassen instellen (bijv. `@/` → `src/`) en overal consequent gebruiken. Dan blijven imports leesbaarder bij diepere mappen.

### 2.3 Dubbele Supabase-importpaden

De codebase importeert overal uit `../lib/supabase` of `../../lib/supabase`. Er is ook `lib/supabaseClient.ts` als re-export. Dat is duidelijk gedocumenteerd; geen bug, maar één importstijl (bijv. altijd `@/lib/supabase`) houdt het consistent.

---

## 3. State en data

### 3.1 Geen globale state buiten auth

Alleen auth staat in context; lijsten, filters en UI-state zitten lokaal in componenten. Voor een grotere app kan dat vermoeiend worden (bijv. filters delen tussen pagina’s).

**Aanbeveling:** Bij behoefte aan gedeelde state (filters, voorkeuren) een lichtgewicht store overwegen (bijv. Zustand), zoals in `docs/CODING-RULES.md`. Niet verplicht voor de huidige omvang.

### 3.2 Geen React Query / SWR

Data wordt met `useEffect` + `useState` opgehaald. Geen caching, geen automatische refetch, geen centrale loading/error-state.

**Aanbeveling:** Voor lijsten en detailpagina’s (admin, opdrachten, profielen) React Query of SWR overwegen: minder boilerplate, betere loading/error-afhandeling en cache-invalidatie na mutaties (zoals na save in ArtsDetail).

### 3.3 useEffect-afhankelijkheden

In o.a. `OpdrachtDetail.tsx` roept `useEffect` `fetchJob()` en `checkIfApplied()` aan, maar die functies zitten niet in de dependency array. Dat kan stale closures of onnodige/ontbrekende runs geven.

**Aanbeveling:** Of de fetch-functies in de dependency array zetten (en met `useCallback` stabiel maken), of de fetch-logica direct in de `useEffect` zetten zodat de dependency array klopt.

---

## 4. UI/UX en feedback

### 4.1 Veel `alert()` voor fouten en succes

In o.a. `OpdrachtDetail.tsx` en `Opdrachtgever/Opdrachten.tsx` worden `alert()` gebruikt voor validatie en API-feedback.

**Aanbeveling:** Toasts of een kleine notificatie-component (bijv. React Hot Toast of een eigen banner) gebruiken en daar succes- en foutmeldingen tonen. Past beter bij een SPA en is toegankelijker.

### 4.2 Inconsistente loading-UI

Sommige pagina’s tonen een spinner (bijv. `ProtectedRoute`, `ArtsDetail`), andere alleen “Laden…” of geen duidelijke loading-state.

**Aanbeveling:** Een herbruikbare `LoadingSpinner` of `PageLoader` component en die overal gebruiken waar data wordt geladen. Eventueel skeleton-screens voor lijsten.

### 4.3 Geen error boundaries

Als een component crasht, valt de hele app om.

**Aanbeveling:** Minimaal één error boundary rond de hoofdinhoud (bijv. in `App.tsx` rond `<Routes>`); optioneel per sectie (admin, arts, opdrachtgever) voor betere foutisolatie.

---

## 5. Forms en validatie

### 5.1 Geen form library

Formulieren gebruiken handmatig `useState` per veld. Bij lange formulieren (bijv. opdracht aanmaken, profiel) wordt dat snel onoverzichtelijk en foutgevoelig.

**Aanbeveling:** React Hook Form (eventueel in combinatie met Zod) voor validatie en minder re-renders, zoals in `docs/CODING-RULES.md`.

### 5.2 Beperkte client-side validatie

Sommige velden zijn `required` in HTML; complexere regels (format, lengte, getallen) ontbreken vaak.

**Aanbeveling:** Validatie expliciet maken met Zod (of Yup) en die koppelen aan de form library; dezelfde schema’s eventueel hergebruiken voor API/Edge Functions.

---

## 6. Performance

### 6.1 Geen code splitting op routes

Alle pagina’s zitten in dezelfde bundle; `App.tsx` importeert elke pagina direct.

**Aanbeveling:** `React.lazy()` en `Suspense` voor route-componenten (bijv. alle `Admin/*`, `Arts/*`, `Opdrachtgever/*` en zwaardere public pagina’s). Snellere initiële load.

### 6.2 Grote chunk

De build waarschuwt voor chunks > 500 kB. Dat komt onder meer door alle routes en lucide-react in één bundle.

**Aanbeveling:** Naast route-based splitting: lucide-react tree-shaken houden (alleen geïmporteerde iconen); controleren of andere zware libs dynamisch geladen kunnen worden.

---

## 7. Toegankelijkheid (a11y)

- Formulierlabels zijn gekoppeld met `htmlFor`/`id` (bijv. Login).
- Er is nog weinig gebruik van ARIA (live regions voor toasts, expand/collapse, tabs).
- Kleurcontrast is redelijk; expliciet controleren met een tool (bijv. axe of Lighthouse) is aan te raden.

**Aanbeveling:** Toasts/notificaties met `role="status"` of `aria-live`; focus management na redirects en modals; en een korte a11y-checklist in de docs.

---

## 8. Beveiliging

- Geen `dangerouslySetInnerHTML` in de bekeken code; dat is goed.
- Supabase RLS hoort server-side rechten af te dwingen; client-side checks zijn een extra laag.

**Aanbeveling:** Geen gevoelige data in client state bewaren langer dan nodig; gevoelige acties (bijv. admin reset wachtwoord) alleen via Edge Functions of beveiligde API.

---

## 9. Testing en tooling

- Geen tests (geen Jest/Vitest, geen React Testing Library) in de repo.
- ESLint staat aan met react-hooks en react-refresh; geen regels voor consistent naming of import-order.

**Aanbeveling:** Een minimale testsetup (Vitest + RTL) en een paar tests voor kritieke flows (login, protected route, een admin-lijst). Optioneel: Prettier en ESLint import-sorting voor eenheid.

---

## 10. Documentatie en conventies

- README en docs (o.a. ADMIN-TEST-ACCOUNT, DEPLOY-BIG-CHECK, GITHUB-SETUP) zijn aanwezig.
- `docs/CODING-RULES.md` beschrijft o.a. Standard.js, React, Tailwind; de app gebruikt echter TypeScript, geen prop-types, en geen Stylus/Next.js. De rules zijn dus deels aspiratief.

**Aanbeveling:** Of de coding rules aanpassen aan de huidige stack (Vite, TypeScript, Tailwind, geen Stylus/Next), of een apart “ArboMatcher stack & conventions”-doc dat naast de algemene rules staat.

---

## Prioriteiten (kort)

| Prioriteit | Actie |
|-----------|--------|
| Hoog | Bug `fetchData` in Admin ArtsDetail oplossen. |
| Hoog | Supabase types (opnieuw) genereren en Database-types repareren zodat de TypeScript-build schoon is. |
| Hoog | `Doctor` (en evt. `Subscription`) in `lib/types.ts` aanvullen met velden die in de app worden gebruikt (bijv. `subscription_type`). |
| Medium | `alert()` vervangen door toasts of een notificatie-component. |
| Medium | Route-based code splitting met `React.lazy` + `Suspense`. |
| Medium | Routes uit `App.tsx` splitsen naar bestanden per domein. |
| Laag | Path-aliassen (`@/`) en consistente imports. |
| Laag | Error boundary rond de app. |
| Laag | Basis testsetup en een paar smoke tests. |

Als je wilt, kan ik in een volgende stap concrete codevoorstellen doen (bijv. voor de `fetchData`-fix of de route-splitsing).
