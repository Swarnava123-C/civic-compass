import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-8 text-center" role="alert">
            <p className="text-foreground font-sans text-lg font-semibold mb-2">Something went wrong</p>
            <p className="text-muted-foreground font-sans text-sm">
              Please refresh the page and try again.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
