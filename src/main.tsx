import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './components/ErrorBoundary';
import { validateSupabaseEnv } from './lib/supabase/client';
import App from './App.tsx';
import './index.css';

const { valid, missingVars } = validateSupabaseEnv();
if (!valid) {
  createRoot(document.getElementById('root')!).render(
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F3F4F6]">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
        <h1 className="text-xl font-bold text-[#0F172A] mb-2">Configuratie ontbreekt</h1>
        <p className="text-gray-600 mb-4">
          Stel bij de portal-deploy de volgende variabelen in: {missingVars.join(', ')}.
        </p>
        <p className="text-sm text-gray-500">Site: Environment variables → VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY</p>
      </div>
    </div>
  );
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
