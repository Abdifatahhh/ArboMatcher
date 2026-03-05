# Test-adminaccount aanmaken

Om in te loggen als **admin** en de admin-omgeving te gebruiken:

## Optie 1: Bestaand account admin maken

1. **Registreer** een normaal account via de app (Register → kies een rol, vul e-mail en wachtwoord in).
2. Ga in **Supabase** naar **Table Editor** → tabel **profiles**.
3. Zoek de rij met het e-mailadres dat je net gebruikte.
4. Zet het veld **role** op **ADMIN** en sla op.
5. Log uit en weer in: je wordt doorgestuurd naar het admin-dashboard.

## Optie 2: E-mail van bestaande gebruiker wijzigen (optioneel)

Als je een test-e-mail wilt gebruiken (bijv. `admin@test.nl`), wijzig dan in de tabel **profiles** het veld **email** naar dat adres. Let op: inloggen gebeurt nog steeds met het wachtwoord dat je bij registratie koos; het e-mailadres in Supabase wordt alleen voor weergave gebruikt. Voor echte e-mailwijziging moet je Supabase Auth gebruiken.

## Demo-data in de admin

Als er **geen data** in de database staat, tonen de adminpagina’s automatisch **demo-data** (voorbeeld-artsen, opdrachten, reacties, abonnementen, enz.). Zo kun je het uiterlijk en de werking van de admin bekijken. Er verschijnt een oranje balk: *"Demo-data wordt getoond"*. Zodra er echte data is, verdwijnt de demo en wordt alleen echte data getoond.
