# Auth rate limits (Supabase)

Bij te veel aanmeld- of inlogpogingen geeft Supabase **429 Too Many Requests**. De app toont dan een cooldown van 2 minuten op de registratiepagina.

## Limieten aanpassen

- **Dashboard:** [Supabase](https://supabase.com/dashboard) → jouw project → **Authentication** → **Rate limits**. Hier zijn o.a. aanpasbaar: OTP, token refresh, verificatie.
- **E-maillimiet:** Standaard ca. 4 e-mails per uur voor signup/recover. Hoger alleen mogelijk met **eigen SMTP** (Auth → Providers → Email).
- **Management API:** Zie [Supabase Docs – Rate limits](https://supabase.com/docs/guides/auth/rate-limits).

## In de app

- Na een 429 op registratie: 2 minuten cooldown + countdown, daarna opnieuw proberen.
- Dubbele signUp-aanvragen worden geblokkeerd (geen dubbele klik).
