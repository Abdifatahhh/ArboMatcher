-- Contractvorm: alleen ZZP, DETACHERING, LOONDIENST. PROJECT is verwijderd.
-- Default voor nieuwe opdrachten op ZZP.
ALTER TABLE jobs ALTER COLUMN job_type SET DEFAULT 'ZZP';
