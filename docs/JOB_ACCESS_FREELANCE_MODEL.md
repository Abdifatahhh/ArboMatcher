# Job access logic – Freelance.nl model

## Summary

- **Visibility:** All jobs are visible to all doctors. No job is hidden based on plan.
- **UI:** Only PRO jobs show a badge/label. STANDARD jobs never show a "STANDARD" label anywhere.
- **Application:** PRO jobs are exclusive to PRO doctors for the first 48 hours; after 48 hours both BASIC and PRO can apply. STANDARD jobs: both can apply anytime.
- **Backend:** 48-hour rule enforced by database trigger on `applications` (BEFORE INSERT).

---

## SQL script

Use the existing migration (safe to run once in Supabase SQL editor):

**`supabase/migrations/20260306120000_doctor_plans_basic_pro_only.sql`**

It:

1. Restricts subscription/doctor plans to **BASIC** and **PRO** (removes unused plans).
2. Ensures **BASIC** is the default for new doctors (`doctors.doctor_plan` DEFAULT 'BASIC').
3. Adds/updates **job_tier** (PRO | STANDARD) and uses existing **created_at** on `jobs`.
4. Implements the 48-hour rule via trigger `trigger_check_application_48h` on `applications`.

No separate migration is required for the Freelance.nl visibility/UI changes; those are in the app code.

---

## Modified files

| File | Change |
|------|--------|
| `src/pages/OpdrachtDetail.tsx` | Fetch `doctor_plan` for ARTS; compute `canApply` (PRO or non-PRO job or PRO job ≥48h). When BASIC + PRO job &lt;48h: disabled apply button, message "Deze PRO opdracht is de eerste 48 uur exclusief voor PRO artsen.", countdown until 48h. PRO badge in header only when `job_tier === 'PRO'`. Toast text aligned with message. |
| `src/pages/Arts/Abonnement.tsx` | Removed all "STANDARD" from copy: "Toegang tot alle opdrachten", "Direct reageren op alle opdrachten". |
| `src/pages/Arts/Favorieten.tsx` | PRO badge only when `job.job_tier === 'PRO'`; otherwise company initials. |
| `src/pages/Arts/Reacties.tsx` | PRO badge only when `application.jobs.job_tier === 'PRO'`; otherwise company initials. |

---

## How the 48-hour early access rule works

1. **Database (trigger)**  
   On INSERT into `applications`, the trigger:
   - Reads the job’s `job_tier` and `created_at`.
   - If `job_tier = 'PRO'` and `created_at >= now() - 48 hours` (job younger than 48h):
     - Reads the applying doctor’s `doctor_plan`.
     - If `doctor_plan != 'PRO'`, raises an exception and the insert is aborted.
   - Otherwise the insert is allowed.

2. **UI (OpdrachtDetail)**  
   - For ARTS users, the page loads the current user’s `doctor_plan`.
   - It computes: PRO job, created &lt; 48h ago → `canApply = false` for BASIC doctors.
   - If `!canApply`: apply button is disabled, message shown: *"Deze PRO opdracht is de eerste 48 uur exclusief voor PRO artsen."*, and a countdown (e.g. "Beschikbaar over X uur") is shown until 48h have passed.
   - After 48h, `canApply` becomes true and BASIC doctors can apply; the same PRO job stays stored as PRO in the database.

3. **Result**  
   PRO doctors can always apply. BASIC doctors can apply to STANDARD jobs anytime and to PRO jobs only after 48 hours. The rule is enforced in the database, so it cannot be bypassed via the UI.

---

## Confirmations

- **All jobs visible to all users**  
  Job listing (e.g. Arts Opdrachten) loads all published jobs with no filter by `job_tier` or plan. Detail page loads the job by id with no plan-based restriction. Every doctor sees every (published) job.

- **Only PRO jobs show a badge/label**  
  - OpdrachtDetail: PRO badge in header only when `job_tier === 'PRO'`.  
  - Arts Opdrachten: PRO badge and "PRO opdracht" only when `job_tier === 'PRO'` (or legacy `is_pro`).  
  - Favorieten / Reacties: PRO badge only when `job_tier === 'PRO'`; otherwise a neutral block (e.g. company initials).  
  The word "STANDARD" is never shown in the interface (only in types/data).
