/*
  # Add PRO field to jobs table
  
  1. Changes
    - Add `is_pro` boolean column to jobs table
    - Default is false (regular job)
    - PRO jobs require a subscription to view full details
    
  2. Purpose
    - Distinguish between regular and PRO job listings
    - Enable paywall functionality for premium content
*/

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_pro boolean DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS applications_count integer DEFAULT 0;
