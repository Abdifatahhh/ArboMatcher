import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import * as Sentry from '@sentry/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <h1 className="text-xl font-bold text-[#0F172A] mb-2">Er is iets misgegaan</h1>
            <p className="text-gray-600 mb-4">
              De pagina kon niet worden geladen. Probeer de pagina te vernieuwen of ga terug naar het startscherm.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#4FA151] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#3E8E45] transition"
            >
              Naar start
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
