-- Migreer legacy job_type waarden naar contractvorm (ZZP, DETACHERING, LOONDIENST).
-- PROJECT, TIJDELIJK, INTERIM -> ZZP; VAST -> LOONDIENST.
UPDATE jobs SET job_type = 'ZZP' WHERE job_type IN ('PROJECT', 'TIJDELIJK', 'INTERIM');
UPDATE jobs SET job_type = 'LOONDIENST' WHERE job_type = 'VAST';
