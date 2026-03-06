# Doctor subscription refactor – summary

## 1. Full SQL script

The migration is in:

**`supabase/migrations/20260306120000_doctor_plans_basic_pro_only.sql`**

You can run that file once in the Supabase SQL editor. It:

- Adds `doctors.doctor_plan` (BASIC | PRO), default BASIC, backfills from `premium_status`.
- Adds `jobs.job_tier` (PRO | STANDARD), default STANDARD, backfills from `is_pro`.
- Restricts `subscriptions.plan` to BASIC | PRO and maps existing ENTERPRISE/PREMIUM_DOCTOR to PRO.
- Creates trigger `trigger_check_application_48h` on `applications` to enforce the 48-hour rule.

If your Postgres version does not accept `EXECUTE FUNCTION`, change the trigger to use `EXECUTE PROCEDURE` (same function name).

---

## 2. Modified files

| File | Changes |
|------|--------|
| `src/lib/types.ts` | `DoctorPlan`, `JobTier`; `Doctor.doctor_plan` (replaced premium_status/subscription_type); `Job.job_tier` (replaced is_pro); `SubscriptionPlan` = BASIC \| PRO only; removed `DoctorSubscriptionType`. |
| `src/services/adminSubscriptionsService.ts` | `SubscriptionPlan` = BASIC \| PRO only. |
| `src/components/Admin/SubscriptionsTable.tsx` | Plans: BASIC, PRO only. |
| `src/components/Admin/SubscriptionsFilters.tsx` | Plan labels: BASIC, PRO only. |
| `src/pages/Arts/Abonnement.tsx` | Rewritten: BASIC/PRO only, uses `doctor_plan`. |
| `src/pages/Arts/Profiel.tsx` | Doctor insert sets `doctor_plan: 'BASIC'` (removed premium_status). |
| `src/pages/Arts/Opdrachten.tsx` | PRO badge uses `job_tier === 'PRO'` (fallback to is_pro for old data). |
| `src/pages/Arts/Dashboard.tsx` | Uses `doctor_plan === 'PRO'` for isPremium. |
| `src/pages/OpdrachtDetail.tsx` | 48h check before apply; handles `PRO_48H_RULE` error from DB. |
| `src/pages/Opdrachtgever/Opdrachten.tsx` | Job insert includes `job_tier` (default STANDARD). |
| `src/pages/Admin/ArtsDetail.tsx` | Edit/save and display use `doctor_plan` (BASIC/PRO); removed premium_status/premium_until. |
| `src/pages/Admin/GebruikerDetail.tsx` | Shows Plan: BASIC/PRO instead of Premium. |
| `src/components/Admin/DoctorsTable.tsx` | PRO badge uses `doctor_plan === 'PRO'`. |
| `src/data/adminDemoData.ts` | demoDoctors: `doctor_plan`; demoJobs: `job_tier`; demoSubscriptions: plan PRO instead of PREMIUM_DOCTOR. |
| `supabase/migrations/20260306120000_doctor_plans_basic_pro_only.sql` | New migration (see above). |

---

## 3. Database schema changes

| Table | Change |
|-------|--------|
| **doctors** | New column `doctor_plan` TEXT NOT NULL DEFAULT 'BASIC' CHECK (doctor_plan IN ('BASIC', 'PRO')). Existing rows backfilled from `premium_status` (true → PRO, else BASIC). `subscription_type` / `premium_status` / `premium_until` left in place for now; app uses only `doctor_plan`. |
| **jobs** | New column `job_tier` TEXT NOT NULL DEFAULT 'STANDARD' CHECK (job_tier IN ('PRO', 'STANDARD')). Backfilled from `is_pro` (true → PRO, false → STANDARD). `is_pro` not dropped. |
| **subscriptions** | Constraint added: plan IN ('BASIC', 'PRO'). Existing plans ENTERPRISE/PREMIUM_DOCTOR updated to PRO, others to BASIC. |
| **applications** | Trigger `trigger_check_application_48h` (BEFORE INSERT) calls `check_application_48h_rule()`. |

---

## 4. How the 48-hour rule is enforced

- **In the database:**  
  Trigger `trigger_check_application_48h` runs **before** every INSERT on `applications`. It:

  1. Reads `job_tier` and `created_at` of the job for the new application.
  2. If `job_tier != 'PRO'`, the row is allowed (STANDARD jobs: all doctors).
  3. If `job_tier = 'PRO'` and `job.created_at >= now() - 48 hours` (job is less than 48h old):
     - It reads `doctor_plan` of the applying doctor.
     - If `doctor_plan != 'PRO'`, it raises exception with code `P0001` and message containing `PRO_48H_RULE`.
  4. If the PRO job is 48h or older, the row is allowed (treated as STANDARD for application purposes).

  So BASIC doctors cannot insert an application for a PRO job that is less than 48 hours old; the check is enforced in the backend, not only in the UI.

- **In the app:**  
  `OpdrachtDetail` checks the same rule before calling the API and shows a clear message. If someone bypasses the UI, the trigger still blocks the insert and the app handles the `PRO_48H_RULE` error and shows the same message.

---

## 5. Confirmation: only BASIC and PRO plans

- **Doctor plans:** Only `doctors.doctor_plan` = BASIC or PRO. New doctors get BASIC by default (DB default and insert in Arts Profiel).
- **Subscription plans (for doctors):** `subscriptions.plan` restricted to BASIC or PRO; ENTERPRISE and PREMIUM_DOCTOR removed from enums and UI; admin and Arts Abonnement use only BASIC/PRO.
- **Job types for this logic:** Jobs use `job_tier` PRO or STANDARD; `is_pro` is only used for backfill and legacy compatibility.

Employer/client subscription logic is out of scope and can be added later.
