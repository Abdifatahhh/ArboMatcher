# admin-delete-user

Verwijdert een gebruiker definitief (profiel + auth). Alleen voor ingelogde admins.

## Deploy

1. Zet het JWT-geheim (nodig voor sessiecontrole):
   - Supabase Dashboard → Project Settings → API → kopieer **JWT Secret**
   - Voer uit: `supabase secrets set JWT_SECRET=<geplakt JWT Secret>`

2. Deploy de function:
   ```bash
   supabase functions deploy admin-delete-user
   ```

Zonder `JWT_SECRET` geeft de function een duidelijke foutmelding.
