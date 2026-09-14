import React from 'react';

/**
 * Top-level error boundary for persona pages.
 * Keeps a crash in one dashboard (e.g. a solver edge case) from taking
 * down the whole shell — the user can recover without a full reload.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production this would ship to Sentry / observability stack (NFR-10).
    if (typeof console !== 'undefined') {
      console.error('[KrishiSetu ErrorBoundary]', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-stone-900 mb-2">Something went wrong</h2>
          <p className="text-stone-500 text-sm mb-6">
            This module hit an unexpected error. Your data is safe — escrow orders and
            listings are unaffected.
          </p>
          {this.state.error && (
            <pre className="text-left text-xs bg-stone-900 text-red-300 rounded-xl p-4 overflow-auto max-h-40 mb-6">
              {String(this.state.error && this.state.error.message)}
            </pre>
          )}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-bold transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
