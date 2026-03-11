-- KVK-extra velden voor opdrachtgevers (uit Zoeken + Basisprofiel)
ALTER TABLE employers ADD COLUMN IF NOT EXISTS vestigingsnummer text;
ALTER TABLE employers ADD COLUMN IF NOT EXISTS kvk_type text;
ALTER TABLE employers ADD COLUMN IF NOT EXISTS kvk_actief boolean;
ALTER TABLE employers ADD COLUMN IF NOT EXISTS rechtsvorm text;
ALTER TABLE employers ADD COLUMN IF NOT EXISTS statutaire_naam text;
