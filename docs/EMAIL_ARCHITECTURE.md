# E-mailarchitectuur – Supabase Auth + Resend

Overzicht: auth-e-mails via **Send Email Hook**, platform-e-mails via **send-email** Edge Function. Beide gebruiken Resend; secrets alleen server-side.

## Twee kanalen

| Kanaal | Doel | Aanroep | Function |
|--------|------|---------|----------|
| **Auth-e-mails** | Signup, wachtwoord reset, magic link, uitnodiging | Supabase Auth (hook) | `send-auth-email` |
| **Business-e-mails** | Welkom, opdracht geplaatst, profiel goedgekeurd, factuur, etc. | App (supabase.functions.invoke) | `send-email` |

## Environment variables

Voor **beide** functions (Edge Function secrets):

| Variable | Gebruik | Verplicht |
|----------|---------|-----------|
| `RESEND_API_KEY` | Resend API key | Ja |
| `SEND_EMAIL_HOOK_SECRET` | Alleen voor `send-auth-email` (webhook-verificatie) | Ja voor auth hook |

Optioneel voor `send-email`: `RESEND_FROM`, `RESEND_REPLY_TO`, `PUBLIC_APP_URL`. Defaults: from `ArboMatcher <noreply@arbomatcher.nl>`, reply_to `support@arbomatcher.nl`.

## Send Email Hook koppelen (auth-e-mails)

1. Deploy: `supabase functions deploy send-auth-email --no-verify-jwt`
2. Dashboard: **Authentication** → **Hooks** → **Send Email** (HTTPS)
3. URL: `https://<PROJECT_REF>.supabase.co/functions/v1/send-auth-email`
4. Genereer secret, zet: `supabase secrets set SEND_EMAIL_HOOK_SECRET="v1,whsec_..."`

Details: `supabase/functions/send-auth-email/README.md`.

## Business-e-mails aanroepen

Vanuit de app (bijv. na job publish, na profiel-approval):

```ts
import {
  sendWelcomeEmail,
  sendOpdrachtGeplaatstEmail,
  sendProfielGoedgekeurdEmail,
  sendFactuurEmail,
} from '../services/emailService';

await sendOpdrachtGeplaatstEmail(opdrachtgeverEmail, job.title);
await sendProfielGoedgekeurdEmail(professionalEmail, profile.full_name ?? undefined);
await sendFactuurEmail(userEmail, 'F-2025-001');
```

## Nieuwe templates

- **Auth (send-auth-email):** zie `supabase/functions/send-auth-email/README.md` → sectie "Nieuwe templates toevoegen".
- **Business (send-email):** in `send-email/index.ts` een nieuwe `renderXxx()` toevoegen en in `renderTemplate()` een `case` voor de template naam; in `emailService.ts` het type en een helperfunctie toevoegen.
