/**
 * Compatibility re-export. Prefer importing from '@/utils/auth' or '../utils/auth'.
 */
export {
  categorizeAuthError,
  getOrCreateProfile,
  type AuthErrorCategory,
  type AuthDiagnostic,
  type CategorizedError,
} from '../utils/auth';
