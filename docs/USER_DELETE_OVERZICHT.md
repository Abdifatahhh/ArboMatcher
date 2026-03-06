# Overzicht: volledig verwijderen van een gebruiker

## Probleem

Bij het verwijderen van een gebruiker bleef data achter of faalde de delete omdat:
1. **Geen centrale volgorde**: losse deletes vanuit de app/Edge Function zonder vaste volgorde.
2. **Conversations geen FK**: `conversations.participant_ids` is een uuid-array zonder foreign key naar `profiles`; CASCADE raakt deze rijen niet.
3. **Geen transactie**: bij een fout kon deels data weg zijn en deels blijven (orphans).
4. **Auth user laatst**: `auth.users` moet als laatste weg; alle applicatiedata moet eerst weg.

## Tabellen gekoppeld aan een gebruiker

| Tabel | Relatie naar gebruiker | FK / CASCADE |
|-------|------------------------|--------------|
| **profiles** | `id` = auth.users.id | REFERENCES auth.users(id) ON DELETE CASCADE |
| **employers** | user_id → profiles(id) | ON DELETE CASCADE |
| **doctors** | user_id → profiles(id) | ON DELETE CASCADE |
| **jobs** | employer_id → employers(id) | ON DELETE CASCADE |
| **applications** | job_id, doctor_id | ON DELETE CASCADE |
| **invites** | job_id, employer_id, doctor_id | ON DELETE CASCADE |
| **favorites** | user_id → profiles(id) | ON DELETE CASCADE |
| **conversations** | participant_ids (array) bevat profile id | **Geen FK** – handmatig verwijderen |
| **messages** | sender_id → profiles(id), conversation_id | ON DELETE CASCADE |
| **reviews** | job_id, employer_id, doctor_id | ON DELETE CASCADE |
| **subscriptions** | user_id → profiles(id) | ON DELETE CASCADE |
| **invoices** | user_id → profiles(id), subscription_id | ON DELETE CASCADE / SET NULL |
| **admin_delete_codes** | target_user_id, admin_id → profiles(id) | ON DELETE CASCADE |
| **content_store** | Geen user-koppeling | – |

## Juiste verwijdervolgorde

1. **Conversations** waar de gebruiker in `participant_ids` zit (geen FK → expliciet verwijderen).  
   → CASCADE verwijdert daarna alle **messages** in die conversations.
2. **Profile** verwijderen (`profiles.id = target_user_id`).  
   → CASCADE verwijdert: employers, doctors, jobs, applications, invites, favorites, subscriptions, invoices, admin_delete_codes, en overige messages (sender_id).
3. **Auth user** verwijderen via Supabase Admin API (kan alleen server-side, niet in SQL).

Alles in stappen 1 en 2 gebeurt **in één transactie** in een centrale SQL-functie. Stap 3 doet de Edge Function na succesvolle aanroep van die functie.

## Oplossing

- **SQL**: functie `admin_delete_user_data(target_user_id uuid)` voert stappen 1 en 2 transactioneel uit en retourneert o.a. aantal verwijderde conversations.
- **Edge Function**: controleert admin, roept `admin_delete_user_data` aan (RPC of service role), daarna `auth.admin.deleteUser(userId)`.
- **Frontend**: roept alleen de Edge Function aan (zoals nu); geen losse delete-calls meer naar meerdere tabellen.

## Geen orphan records

- Alles wat via FK aan `profiles` hangt wordt door CASCADE meegenomen bij delete van `profiles`.
- Conversations worden expliciet verwijderd voordat we het profiel verwijderen, zodat er geen conversations overblijven met een verwijderd profile-id in `participant_ids`.

## Delete-flow in de app

1. **Frontend** (Admin → Gebruiker bewerken): knop "Gebruiker definitief verwijderen" → bevestiging → `deleteUserPermanently(userId)`.
2. **adminUsersService**: `refreshSession()` → POST naar Edge Function met `{ userId, accessToken, supabaseUrl }`.
3. **Edge Function** `admin-delete-user`: valideert sessie (Auth API), controleert ADMIN-rol, roept `admin_delete_user_data(userId)` aan, daarna `auth.admin.deleteUser(userId)`.
4. **Database** `admin_delete_user_data`: in één transactie conversations + profile (rest via CASCADE).

Er zijn geen losse frontend-deletes meer; alles loopt via deze ene flow.

## Controle op orphans (optioneel)

Na een verwijdering kun je controleren of er geen losse verwijzingen blijven:

```sql
-- Conversations waar een participant_id niet (meer) in profiles staat
SELECT c.id, c.participant_ids
FROM conversations c
WHERE EXISTS (
  SELECT 1 FROM unnest(c.participant_ids) AS pid
  WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = pid)
);
-- Verwacht: 0 rijen.

-- Profiles zonder auth user (zou leeg moeten zijn na correcte delete)
SELECT p.id FROM profiles p
WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.id);
-- Verwacht: 0 rijen (profiles.id FK naar auth.users).
```

Na een geslaagde delete moeten beide queries **0 rijen** geven.

---

## Testchecklist (admin delete user)

- [ ] Inloggen als admin, naar Gebruiker bewerken van een **andere** gebruiker.
- [ ] "Gebruiker definitief verwijderen" → bevestigen.
- [ ] Verwachting: succesmelding; geen "Sessie verlopen" of 500.
- [ ] Controleren: gebruiker komt niet meer voor in Gebruikersoverzicht.
- [ ] Orphan-queries draaien (zie hierboven): beide 0 rijen.
- [ ] Zelf-verwijderen blokkeren: als admin op eigen profiel "Gebruiker definitief verwijderen" → fout "Je kunt je eigen account niet verwijderen."
- [ ] Niet-admin: inloggen als ARTS/OPDRACHTGEVER, direct aanroepen van de Edge Function (bijv. via curl met hun token) → 403.

---

## Foutafhandeling

| Scenario | Waar | Gedrag |
|----------|------|--------|
| userId niet meegegeven / lege token | Edge Function | 400, "userId en accessToken zijn verplicht." |
| Sessie ongeldig of verlopen | Edge Function | 401, "Sessie verlopen. Log opnieuw in." |
| Caller is geen ADMIN | Edge Function | 403, "Alleen beheerders kunnen gebruikers verwijderen." |
| Caller probeert zichzelf te verwijderen | Edge Function | 400, "Je kunt je eigen account niet verwijderen." |
| Profiel bestaat niet | SQL RPC | Exception P0002, "profiel met id ... bestaat niet." |
| RPC faalt (transactie rollback) | Edge Function | 500, RPC-foutmelding; auth.deleteUser wordt **niet** aangeroepen. |
| RPC geeft geen ok=true | Edge Function | 500, "RPC gaf geen succes terug."; auth.deleteUser wordt **niet** aangeroepen. |
| Auth user bestaat niet (bij deleteUser) | Edge Function | 500, "Auth-gebruiker bestond niet of was al verwijderd." (data is dan al weg). |

---

## Beoordeling: conversation_participants-tabel i.p.v. participant_ids

**Huidige situatie:** `conversations.participant_ids uuid[]` zonder FK naar `profiles`. Gevolgen:
- Geen CASCADE bij delete user → we moeten conversations handmatig verwijderen in `admin_delete_user_data`.
- Orphan-risico als er ergens anders conversations worden aangemaakt of participant_ids worden aangepast.
- Geen DB-constraint dat participant_ids alleen bestaande profile-ids bevatten.

**Advies:** Op termijn **vervangen door een junction-tabel** met echte foreign keys, bijvoorbeeld:

```sql
-- Voorbeeld (niet in huidige migratie)
CREATE TABLE conversation_participants (
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, profile_id)
);
```

- **Voordelen:** CASCADE werkt; geen orphans; constraint op bestaande profiles; eenvoudigere orphan-queries.
- **Nadelen:** Migratie van bestaande data (participant_ids → rijen); aanpassing van alle queries die participant_ids gebruiken.
- **Conclusie:** Aanbevolen bij een volgende grotere refactor van het chat/conversation-model. De huidige delete-flow blijft correct zolang `admin_delete_user_data` conversations expliciet verwijdert (zoals nu).
