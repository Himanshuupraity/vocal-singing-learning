import { Component, type ReactNode } from 'react';
import { Alert, Button } from './ui';
import { reportError } from '../lib/errorReporting';

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    reportError(error, 'react');
  }
  render() {
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
