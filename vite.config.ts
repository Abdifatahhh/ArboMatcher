import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

const hasSentryEnv =
  process.env.SENTRY_AUTH_TOKEN &&
  process.env.SENTRY_ORG &&
  process.env.SENTRY_PROJECT;

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === 'production' && hasSentryEnv
      ? [
          sentryVitePlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            sourcemaps: { assets: './dist/**' },
          }),
        ]
      : []),
  ],
  build: {
    sourcemap: mode === 'production',
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
