import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, validateSupabaseEnv, checkDatabaseHealth, type HealthCheckResult } from '../lib/supabase';
import { getOrCreateProfile, categorizeAuthError, type CategorizedError } from '../utils/auth';
import type { Profile } from '../lib/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  healthStatus: HealthCheckResult | null;
  signIn: (email: string, password: string) => Promise<{ profile: Profile | null; error: CategorizedError | null }>;
  signUp: (email: string, password: string, role: Profile['role']) => Promise<{ error: CategorizedError | null; hasSession?: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult | null>(null);

  const envValidation = validateSupabaseEnv();

  useEffect(() => {
    if (!envValidation.valid) {
      setHealthStatus({
        healthy: false,
        category: 'env_missing',
        error: `Missing: ${envValidation.missingVars.join(', ')}`,
        timestamp: new Date().toISOString(),
        hostname: window.location.hostname,
      });
      setLoading(false);
      return;
    }

    let mounted = true;

    const AUTH_INIT_TIMEOUT_MS = 12000;

    const initializeAuth = async () => {
      const timeoutId = setTimeout(() => {
        if (mounted) setLoading(false);
      }, AUTH_INIT_TIMEOUT_MS);

      try {
        const health = await checkDatabaseHealth();
        if (mounted) setHealthStatus(health);

        if (!health.healthy) {
          clearTimeout(timeoutId);
          if (mounted) setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        setUser(session?.user ?? null);

        if (session?.user) {
          const { profile: profileData } = await getOrCreateProfile(
            session.user.id,
            session.user.email || ''
          );
          if (mounted) setProfile(profileData);
        }

        if (mounted) setLoading(false);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const { profile: profileData } = await getOrCreateProfile(
            session.user.id,
            session.user.email || ''
          );
          if (mounted) setProfile(profileData);
        } else {
          if (mounted) setProfile(null);
        }
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [envValidation.valid, envValidation.missingVars.join(',')]);

  const refreshProfile = async () => {
    if (user) {
      const { profile: profileData } = await getOrCreateProfile(user.id, user.email || '');
      setProfile(profileData);
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ profile: Profile | null; error: CategorizedError | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        const categorized = categorizeAuthError(error, 'auth');
        return { profile: null, error: categorized };
      }

      if (!data.user) {
        return {
          profile: null,
          error: {
            category: 'unknown',
            userMessage: 'Inloggen mislukt. Probeer opnieuw.',
            technicalMessage: 'No user returned from signInWithPassword',
          },
        };
      }

      const { profile: profileData, error: profileError } = await getOrCreateProfile(
        data.user.id,
        data.user.email || email
      );

      if (profileError) {
        setUser(data.user);
        return { profile: null, error: profileError };
      }

      setUser(data.user);
      setProfile(profileData);
      return { profile: profileData, error: null };
    } catch (err) {
      const categorized = categorizeAuthError(err, 'auth');
      return { profile: null, error: categorized };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    role: Profile['role']
  ): Promise<{ error: CategorizedError | null; hasSession?: boolean }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } },
      });

      if (error) {
        const categorized = categorizeAuthError(error, 'auth');
        return { error: categorized };
      }

      if (!data.user) {
        return {
          error: {
            category: 'unknown',
            userMessage: 'Registratie mislukt. Probeer opnieuw.',
            technicalMessage: 'No user returned from signUp',
          },
        };
      }

      return { error: null, hasSession: !!data.session };
    } catch (err) {
      const categorized = categorizeAuthError(err, 'auth');
      return { error: categorized };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
  };

  if (!envValidation.valid) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900 mb-2">
            Configuratiefout
          </h1>
          <p className="text-gray-600 text-center mb-4">
            Supabase omgevingsvariabelen ontbreken in deze deployment.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 text-sm">
            <p className="font-mono text-gray-700">
              Host: {window.location.hostname}
            </p>
            <p className="font-mono text-red-600 mt-2">
              Ontbrekend: {envValidation.missingVars.join(', ')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        healthStatus,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
