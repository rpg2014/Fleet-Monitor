import React from 'react';
import { Button, Card, CardContent } from './ui';

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
                <div className="container mx-auto px-4 py-8">
                    <Card className="max-w-2xl mx-auto">
                        <CardContent>
                            <div className="text-center space-y-4">
                                <h2 className="text-xl font-semibold text-red-400">Something went wrong</h2>
                                <p className="text-gray-300">An error occurred while rendering this component.</p>
                                {this.state.error && (
                                    <pre className="bg-gray-900 p-4 rounded text-sm text-red-300 overflow-auto">
                                        {this.state.error.message}
                                    </pre>
                                )}
                                <Button 
                                    variant="outline" 
                                    onClick={() => this.setState({ hasError: false })}
                                >
                                    Try again
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
