import type { ConsentPreferences } from './types';

/**
 * For the flow where ArboMatcher proactively sees a match between a professional
 * and an organisation's opdracht (outside regular applications). Use these checks
 * when building/serving "suggested candidates" to organisations.
 *
 * - Include a professional in suggested-match list only if canIncludeInSuggestedMatch(profile).
 * - Show name + profile/CV to the organisation only if canShareProfileCvInSuggestedMatch(profile).
 *   If only inform_candidate is true, you may show e.g. "Een professional matcht" without name.
 */

export function canIncludeInSuggestedMatch(profile: { consent_preferences?: ConsentPreferences | null }): boolean {
  const c = profile.consent_preferences;
  return c?.inform_candidate === true;
}

export function canShareProfileCvInSuggestedMatch(profile: { consent_preferences?: ConsentPreferences | null }): boolean {
  const c = profile.consent_preferences;
  return c?.share_profile_cv === true;
}
