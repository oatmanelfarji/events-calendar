import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

/**
 * Error boundary component to catch and handle React rendering errors.
 * Prevents the entire app from crashing when a component throws an error.
 */
export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Log error to console in development
		if (process.env.NODE_ENV === "development") {
			console.error("ErrorBoundary caught an error:", error, errorInfo);
		}
		// TODO: Send to error reporting service in production
	}

	render() {
		if (this.state.hasError) {
			// Use custom fallback if provided
			if (this.props.fallback) {
				return this.props.fallback;
			}

			// Default error UI
			return (
				<div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
					<div className="max-w-md space-y-4">
						<h2 className="text-2xl font-bold text-destructive">
							Something went wrong
						</h2>
						<p className="text-muted-foreground">
							An unexpected error occurred. Please try refreshing the page.
						</p>
						{process.env.NODE_ENV === "development" && this.state.error && (
							<pre className="p-4 mt-4 text-xs text-left bg-muted rounded-lg overflow-auto max-h-40">
								{this.state.error.message}
							</pre>
						)}
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="px-4 py-2 mt-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
						>
							Refresh Page
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
