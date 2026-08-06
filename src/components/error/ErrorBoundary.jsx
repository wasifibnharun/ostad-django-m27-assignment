import { Component } from 'react';
import { logError } from '../../utils/logger';

// [REQ-22] An ErrorBoundary class component with getDerivedStateFromError and componentDidCatch.
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // [REQ-22] componentDidCatch must call logError
    logError('ErrorBoundary', { error, errorInfo });
  }

  resetBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetBoundary);
      }
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}