/*
  # Verwijder overbodige objecten m.b.t. user delete

  - admin_request_user_deletion: was voor code-flow (niet meer gebruikt)
  - admin_delete_codes: tabel voor eenmalige codes (niet meer gebruikt)
  - admin_delete_user_data: was voor Edge Function (we gebruiken nu admin_delete_user_by_admin)

  Blijft bestaan: admin_delete_user_by_admin (actieve delete), admin_check_orphans (diagnostiek).
*/

DROP FUNCTION IF EXISTS public.admin_request_user_deletion(uuid);
DROP FUNCTION IF EXISTS public.admin_delete_user_data(uuid);
DROP TABLE IF EXISTS public.admin_delete_codes;
