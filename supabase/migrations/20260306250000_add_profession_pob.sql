-- Add POB (Praktijkondersteuner bedrijfsarts) to profession options (documentation only; columns are text, no CHECK).

COMMENT ON COLUMN professionals.profession IS 'bedrijfsarts | arbo_arts | verzekeringsarts | pob | casemanager_verzuim';
COMMENT ON COLUMN professionals.profession_type IS 'BEDRIJFSARTS | ARBO_ARTS | VERZEKERINGSARTS | POB | CASEMANAGER_VERZUIM';
