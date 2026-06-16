import React, { Component } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // In production, log this to an error reporting service (e.g., Sentry, Firebase Crashlytics)
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-primary-950/50 rounded-3xl border border-rose-500/20">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Something went wrong</h2>
          <p className="text-primary-300 max-w-md mb-8">
            We've encountered an unexpected issue. Our team has been notified.
          </p>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw className="w-4 h-4" />
            Reload Page
          </button>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-8 text-left bg-black/40 p-4 rounded-xl border border-white/10 w-full max-w-2xl overflow-auto text-xs font-mono text-rose-300">
              <div className="font-bold mb-2">{this.state.error.toString()}</div>
              <div>{this.state.errorInfo?.componentStack}</div>
            </div>
          )}
        </div>
      );
    }

    return this.props.children; 
  }
}
