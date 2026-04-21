import React, { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };
    children: any;

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-xl border border-red-50 text-center space-y-8">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <AlertTriangle className="w-12 h-12 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Oops! Something went wrong.</h1>
                            <p className="text-gray-500 font-medium mt-4 leading-relaxed">
                                We encountered an unexpected error. Don't worry, it's not you, it's us.
                            </p>
                        </div>
                        
                        {import.meta.env.DEV && (
                            <div className="p-4 bg-red-50 rounded-2xl text-left overflow-auto max-h-40">
                                <code className="text-xs text-red-600 font-mono">{this.state.error?.toString()}</code>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={() => window.location.reload()}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all"
                            >
                                <RefreshCcw className="w-5 h-5" />
                                Try Again
                            </button>
                            <Link 
                                to="/" 
                                onClick={() => this.setState({ hasError: false })}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all"
                            >
                                <Home className="w-5 h-5" />
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
