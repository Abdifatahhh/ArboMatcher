# Opdracht: contractvorm en werkwijze

## Huidige structuur (na refactor)

### Contractvorm (veld `job_type` in DB)

- **ZZP** – weergave: ZZP / Freelance  
- **DETACHERING** – weergave: Detachering  
- **LOONDIENST** – weergave: Loondienst  

Het oude “type opdracht” (TIJDELIJK, INTERIM, VAST, PROJECT) is vervangen door deze drie waarden.

### Werkwijze (veld `remote_type` in DB)

- **ONSITE** – weergave: Op locatie  
- **HYBRID** – weergave: Hybride  
- **REMOTE** – weergave: Remote (consult)  

### Centrale plek

- **Types en opties:** `src/lib/opdrachtConstants.ts`  
- **Label-helpers:** `getContractFormLabel()`, `getRemoteTypeLabel()`  

### Fallback voor bestaande data

Bestaande opdrachten met oude `job_type`-waarden worden in de UI nog correct getoond:

| Oude waarde | Getoond als        |
|-------------|--------------------|
| TIJDELIJK   | ZZP / Freelance    |
| INTERIM     | ZZP / Freelance    |
| VAST        | Loondienst         |
| PROJECT     | ZZP / Freelance (waarde is verwijderd; bestaande records worden gemigreerd naar ZZP) |

Bij opslaan/bewerken worden alleen ZZP, DETACHERING, LOONDIENST geaccepteerd; oude waarden worden via `normalizeContractForm()` omgezet.

### Database

- `20260310120000_job_type_contractvorm_default.sql`: default voor `jobs.job_type` is `'ZZP'`.
- `20260310120001_job_type_migrate_legacy_to_contractvorm.sql`: bestaande PROJECT/TIJDELIJK/INTERIM → ZZP, VAST → LOONDIENST.
- Kolomnaam blijft `job_type`.
