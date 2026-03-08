# Send Auth Email – setup (eenmalig)

Volg deze stappen om auth-e-mails via Resend + Send Email Hook in te schakelen.

## 1. Resend API key

- Ga naar [resend.com/api-keys](https://resend.com/api-keys) en maak een API key aan.
- Kopieer de key (begint met `re_`).

## 2. Supabase CLI (in dit project)

De CLI staat al in het project als dev dependency. **Alle onderstaande commando’s uitvoeren vanuit de projectmap**, zodat `npx supabase` gebruikt wordt:

```powershell
cd "c:\Temp\ArboMatcher 0.25\ArboMatcher 0.25\ArboMatcher"
```

Project koppelen (eenmalig):

```powershell
npx supabase login
npm run supabase:link
```

Als je een ander project gebruikt: pas in `package.json` de `supabase:link` script aan of run `npx supabase link --project-ref JOUW_PROJECT_REF`. Project reference vind je in Supabase Dashboard → Project Settings → General.

## 3. Hook secret genereren

1. Ga naar [Supabase Dashboard](https://supabase.com/dashboard) → jouw project.
2. **Authentication** → **Hooks**.
3. Bij **Send Email** (of "Create new hook" → Send Email): klik **Generate secret**.
4. Kopieer het geheim (formaat: `v1,whsec_...`). Bewaar het veilig; je ziet het maar één keer.

## 4. Secrets zetten en function deployen

In PowerShell, **vanuit de projectmap** (waar `package.json` staat):

```powershell
cd "c:\Temp\ArboMatcher 0.25\ArboMatcher 0.25\ArboMatcher"

# Vervang re_xxxx en v1,whsec_... door je echte waarden
npx supabase secrets set RESEND_API_KEY=re_xxxx
npx supabase secrets set SEND_EMAIL_HOOK_SECRET="v1,whsec_xxxx"

# Deploy de auth-email function
npm run supabase:deploy-auth-email
```

Na de deploy krijg je een URL. Noteer je **project reference** (staat in de URL, bijv. `apizxgqpdledjutgitpw`).

## 5. Hook in Dashboard koppelen

1. Supabase Dashboard → **Authentication** → **Hooks**.
2. **Send Email** (HTTPS) → **Create** of **Edit**.
3. **URL** invullen:
   ```
   https://JOUW_PROJECT_REF.supabase.co/functions/v1/send-auth-email
   ```
   (vervang `JOUW_PROJECT_REF` door je project reference).
4. Het **secret** heb je al in stap 3 gegenereerd en in stap 4 gezet; de hook gebruikt hetzelfde secret.
5. Opslaan.

## 6. Testen

- Maak een nieuw testaccount aan (registratie) of vraag “wachtwoord vergeten” aan.
- Controleer of je de ArboMatcher-mail ontvangt (en of de link werkt).
- In Resend → Logs zie je of de mail is verstuurd.

## Problemen?

### Geen e-mail na registratie, niets in Resend

1. **Confirm email aanzetten**  
   Supabase stuurt alleen een verificatiemail als dat aan staat:
   - Dashboard → **Authentication** → **Providers** → tab **Email**.
   - Zet **“Confirm email”** op **ON** en sla op.  
   Zonder dit wordt er bij aanmelding geen mail verstuurd (dus ook geen aanroep naar de hook).

2. **“Enable Send Email hook” moet aan staan**  
   - Dashboard → **Authentication** → **Hooks** → **Send Email**.
   - De toggle **“Enable Send Email hook”** moet **aan** (groen) staan. Als die uit staat, gebruikt Supabase geen hook en geen SMTP voor auth-mails (of alleen SMTP als je dat apart hebt geconfigureerd).

3. **Controleren of de hook wordt aangeroepen**  
   - Dashboard → **Edge Functions** → **send-auth-email** → tab **Invocations** of **Logs**.  
   - Maak een **nieuw** testaccount aan (ander e-mailadres) of gebruik “Wachtwoord vergeten”.  
   - **Geen nieuwe regels?** → De hook wordt niet aangeroepen. Controleer:
     - Hooks → Send Email: toggle **aan**, type **HTTPS**, URL correct.
     - “Confirm email” aan (bij registratietest).
   - **Wel requests, maar 401?** → Verkeerd hook secret. Nieuw secret genereren bij Hooks, dan:  
     `npx supabase secrets set SEND_EMAIL_HOOK_SECRET="v1,whsec_..."`  
     en opnieuw deployen: `npm run supabase:deploy-auth-email`.

3. **Overig**
   - **RESEND_API_KEY:** Geldige key; bij eigen domein (bijv. `noreply@arbomatcher.nl`) domein in Resend verifiëren.
   - Resend → **Logs**: zie je daar wel een mail na een geslaagde hook-aanroep?
