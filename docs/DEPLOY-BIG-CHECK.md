# BIG-check Edge Function deployen

Zodat de knop **"BIG direct controleren"** in de admin werkt (en je geen "API niet bereikbaar" meer ziet), moet de Edge Function **eenmalig** naar Supabase worden gedeployed.

> **Als je foutmelding "npm is not recognized" krijgt:** gebruik dan het script hieronder (stap 1) of dubbelklik op `scripts\supabase-login.cmd`.

## Stappen (eenmalig + daarna alleen stap 3)

1. **Inloggen bij Supabase (eenmalig)**  
   **Als `npm` niet wordt herkend in je terminal:** dubbelklik op  
   `scripts\supabase-login.cmd`  
   (of in PowerShell: `.\scripts\supabase-login.ps1`).  
   Anders in de projectmap: `npm run supabase:login`.  
   Er opent een pagina in je browser; log in met je Supabase-account.

2. **Project koppelen (eenmalig)**  
   Dubbelklik op `scripts\supabase-link.cmd` (of in de projectmap: `npm run supabase:link`).  
   Als er om een databasewachtwoord wordt gevraagd: dit is het wachtwoord van je Supabase-project (Dashboard → Project Settings → Database).

3. **Edge Function deployen**  
   Dubbelklik op `scripts\supabase-deploy.cmd` (of in de projectmap: `npm run supabase:deploy`).  
   Daarna is de BIG-check API bereikbaar en zou "API niet bereikbaar" weg moeten zijn.

## Samenvatting

- **Eerste keer:** `supabase-login.cmd` → `supabase-link.cmd` → `supabase-deploy.cmd` (of de npm-run varianten)
- **Later (bij wijzigingen aan de functie):** alleen `supabase-deploy.cmd` (of `npm run supabase:deploy`)

De Supabase CLI staat als dev-dependency in het project; je hoeft niets globaal te installeren.
