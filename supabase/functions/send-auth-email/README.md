# Send Auth Email (Supabase Auth Hook + Resend)

Vervangt de standaard Supabase Auth e-mails. Alle auth-gerelateerde mails (bevestiging, wachtwoord reset, magic link, uitnodiging) worden via deze Edge Function en Resend verstuurd, in ArboMatcher-stijl.

## Environment variables

Stel deze in als **Supabase Edge Function secrets** (niet in de frontend):

| Variable | Verplicht | Beschrijving |
|----------|-----------|--------------|
| `RESEND_API_KEY` | Ja | Resend API key (bijv. `re_xxxx`) |
| `SEND_EMAIL_HOOK_SECRET` | Ja | Geheim uit Supabase Dashboard → Auth → Hooks. Formaat: `v1,whsec_<base64>` |

Optioneel:
- Geen; `from` en `reply_to` staan vast in de code (ArboMatcher &lt;noreply@arbomatcher.nl&gt;, support@arbomatcher.nl).

## Send Email Hook koppelen in Supabase Dashboard

1. Ga naar **Supabase Dashboard** → je project → **Authentication** → **Hooks**.
2. Klik op **Create new hook** of open **Send Email**.
3. **Hook type:** Send Email (HTTPS).
4. **URL:** vul de URL van deze Edge Function in:
   ```text
   https://<PROJECT_REF>.supabase.co/functions/v1/send-auth-email
   ```
   Vervang `<PROJECT_REF>` door je project reference (te vinden in Project Settings → General).
5. Klik op **Generate secret** en kopieer het geheim. Zet het in je secrets:
   ```bash
   supabase secrets set SEND_EMAIL_HOOK_SECRET="v1,whsec_<gegenereerde_waarde>"
   ```
6. Sla de hook op. Vanaf dan stuurt Supabase Auth geen eigen e-mails meer; elke auth-mail gaat naar deze function.

## Deploy

```bash
supabase functions deploy send-auth-email --no-verify-jwt
```

`--no-verify-jwt` is nodig omdat de hook door Supabase Auth wordt aangeroepen met een webhook-signatuur, niet met een gebruikers-JWT.

## Ondersteunde e-mailtypes

- **signup** – Bevestig e-mailadres
- **recovery** – Wachtwoord opnieuw instellen
- **magiclink** – Inloglink (passwordless)
- **invite** – Uitnodiging om account aan te maken
- **email_change** – Bevestig wijziging e-mailadres
- **reauthentication** – Bevestig inloggen (bv. voor gevoelige actie)

## Nieuwe templates toevoegen

1. **Nieuwe action type van Supabase**  
   Als Supabase een nieuw `email_action_type` toevoegt:
   - In `index.ts`: voeg de type toe aan het `ActionType`-type en aan de `supported`-array.
   - In `getTemplate()`: voeg een `case` toe dat de juiste template rendert (of hergebruik een bestaande).

2. **Nieuwe auth-template (eigen layout)**  
   - Maak in `templates/` een bestand, bijv. `mijn-template.ts`.
   - Exporteer een functie die `{ subject: string; html: string }` teruggeeft. Gebruik `wrapBody`, `ctaButton`, `otpCode` uit `templates/layout.ts` voor consistente stijl.
   - In `index.ts` in `getTemplate()` dit template aanroepen voor het gewenste `email_action_type`.

3. **Stijl aanpassen**  
   Kleuren en layout staan in `templates/layout.ts` (`LAYOUT`, `wrapBody`, `ctaButton`, `otpCode`). Pas daar de huisstijl aan.

## Scheiding auth vs. business

- **Auth-e-mails** (signup, recovery, magic link, invite) → **send-auth-email** (deze function), aangeroepen door Supabase via de Send Email Hook. Geen aanroep vanuit de app.
- **Business-e-mails** (welkom, opdracht geplaatst, profiel goedgekeurd, factuur) → **send-email** Edge Function, aangeroepen vanuit de app via `emailService.ts`. Gebruik geen auth hook daarvoor.
