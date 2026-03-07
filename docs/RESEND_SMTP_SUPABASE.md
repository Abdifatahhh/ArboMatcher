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

## Kort overzicht

1. Resend: account → API Key aanmaken → (optioneel) domein verifiëren.  
2. Supabase: Authentication → Email/SMTP → Custom SMTP aan, host `smtp.resend.com`, port `465`, user `resend`, wachtwoord = API Key.  
3. Testen met een nieuwe registratie.
