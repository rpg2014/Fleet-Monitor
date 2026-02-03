import React from 'react';
import { Alert, Button } from 'react-bootstrap';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<
    React.PropsWithChildren<{}>,
    ErrorBoundaryState
> {
    constructor(props: React.PropsWithChildren<{}>) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    override render() {
        if (this.state.hasError) {
            return (
                <div className="container mt-5">
                    <Alert variant="danger">
                        <Alert.Heading>Something went wrong</Alert.Heading>
                        <p>An error occurred while rendering this component.</p>
                        <pre>{this.state.error?.message}</pre>
                        <hr />
                        <Button 
                            variant="outline-danger" 
                            onClick={() => this.setState({ hasError: false })}
                        >
                            Try again
                        </Button>
                    </Alert>
                </div>
            );
        }

        return this.props.children;
    }
}
