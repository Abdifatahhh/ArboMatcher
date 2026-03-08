-- Flag so we only send "Account bevestigd" email once per user (triggered from /verificatie-gelukt).
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_bevestigd_email_sent boolean DEFAULT false;
COMMENT ON COLUMN profiles.account_bevestigd_email_sent IS 'True after we sent the post-confirmation "Account bevestigd" email.';
