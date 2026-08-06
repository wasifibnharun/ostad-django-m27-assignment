import { AppProviders } from './app/AppProviders';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { FallbackUI } from './components/error/FallbackUI';

export default function App() {
  return (
    // [REQ-22] Wrap the whole <App /> in one boundary
    <ErrorBoundary fallback={(error, reset) => <FallbackUI error={error} resetBoundary={reset} />}>
      <AppProviders />
    </ErrorBoundary>
  );
}