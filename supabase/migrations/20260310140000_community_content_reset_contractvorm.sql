-- Wis opgeslagen community-onderwerpen en -artikelen zodat de app
-- de actuele teksten uit code laadt (ZZP, detachering, loondienst).
-- Later: code aanpassen in src/data/communityTopics.ts / communityArticles.ts,
-- deployen, en in Admin → Community beheer → "Reset naar standaard" om opnieuw uit code te laden.
DELETE FROM content_store WHERE key IN ('community_topics', 'community_articles');
