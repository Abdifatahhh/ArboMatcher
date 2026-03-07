# Resend instellen met Supabase

Met Resend als SMTP verstuur je verificatie- en wachtwoordmails via Resend in plaats van de standaard Supabase-limiet (ca. 4 e-mails/uur).

## 1. Resend-account

1. Ga naar [resend.com](https://resend.com) en maak een account.
2. **API Keys:** [resend.com/api-keys](https://resend.com/api-keys) → **Create API Key**. Geef een naam (bijv. "ArboMatcher Supabase") en kopieer de key (die zie je maar één keer).
3. **Domain (aanbevolen):** [resend.com/domains](https://resend.com/domains) → **Add Domain** → voer je domein in (bijv. `arbomatcher.nl`). Voeg de DNS-records toe die Resend toont bij je domeinprovider. Na verificatie mag je vanaf dat domein versturen (bijv. `noreply@arbomatcher.nl`).  
   Zonder eigen domein kun je tijdelijk het Resend-testdomein gebruiken (beperkt; zie Resend-docs).

## 2. Supabase: Custom SMTP

1. Ga naar [Supabase Dashboard](https://supabase.com/dashboard) → jouw project.
2. **Authentication** → **Providers** → tab **Email** (of **SMTP Settings** / onderdeel "Email" bij Notifications).
3. Zet **Enable Custom SMTP** aan (of vergelijkbare optie).
4. Vul in:

   | Veld        | Waarde                    |
   |------------|---------------------------|
   | **Sender email** | Bijv. `noreply@arbomatcher.nl` of `onboarding@resend.dev` (test) |
   | **Sender name**  | Bijv. `ArboMatcher`       |
   | **Host**         | `smtp.resend.com`         |
   | **Port**         | `465`                     |
   | **Username**     | `resend`                  |
   | **Password**     | Je Resend **API Key**     |

5. Sla op (**Save**).

## 3. Controleren

- Stel in Supabase **Authentication** → **Email** zo nodig "Confirm email" aan.
- Maak een testaccount aan op je site; je zou een verificatiemail via Resend moeten ontvangen.
- In Resend → **Logs** zie je of de mails zijn verstuurd.

## 4. Limieten

- Met custom SMTP gebruikt Supabase jouw Resend-limiet (o.a. 3.000/maand op het gratis plan).
- Eventuele rate limits voor auth kun je nog instellen onder **Authentication** → **Rate limits** in Supabase.

## Eigen e-mails via Edge Function (Resend API)

Voor transactional mails (welkom, nieuwe reactie, uitnodiging) gebruik je de **Resend API** via de Edge Function `send-email`:

1. **Secrets:** Supabase Dashboard → Edge Functions → Secrets, of CLI:
   ```bash
   supabase secrets set RESEND_API_KEY=re_xxxxxxxx
   ```
   Optioneel: `RESEND_FROM` (bijv. `ArboMatcher <noreply@arbomatcher.nl>`), `PUBLIC_APP_URL`.

2. **Aanroep:** Zie `supabase/functions/send-email/README.md`. Vanuit de app: `import { sendWelcomeEmail, sendNewApplicationEmail } from '../services/emailService'`.

3. Dezelfde Resend API Key kan voor SMTP (Auth) en voor de Edge Function worden gebruikt; voor de function moet de key als secret `RESEND_API_KEY` staan.

## Kort overzicht

1. Resend: account → API Key aanmaken → (optioneel) domein verifiëren.  
2. Supabase: Authentication → Email/SMTP → Custom SMTP aan, host `smtp.resend.com`, port `465`, user `resend`, wachtwoord = API Key.  
3. Eigen mails: `supabase secrets set RESEND_API_KEY=re_xxx`, daarna Edge Function `send-email` aanroepen (zie send-email/README.md).
4. Testen met een nieuwe registratie (verificatiemail) en/of aanroep van `send-email`.
