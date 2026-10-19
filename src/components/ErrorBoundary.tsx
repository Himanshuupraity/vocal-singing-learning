import { Component, type ReactNode } from 'react';
import { Alert, Button } from './ui';
import { reportError } from '../lib/errorReporting';
import { isChunkError } from '../lib/updates';

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    if (!isChunkError(error)) reportError(error, 'react');
  }
  render() {
    if (this.state.error && isChunkError(this.state.error)) {
      // This tab is running an older version whose page files were replaced by a new deploy.
      return (
        <Alert tone="info" title="SurSadhana was just updated">
          This page needs the new version. Refresh to load it — your progress is saved.
          <div className="mt-3">
            <Button onClick={() => window.location.reload()}>Refresh now</Button>
          </div>
        </Alert>
      );
    }
    if (this.state.error) {
      return (
        <div className="space-y-4">
          <Alert tone="danger" title="Something went wrong on this page">
            {this.state.error.message}. Your saved progress is safe.
          </Alert>
          <Button onClick={() => this.setState({ error: null })}>Try again</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
