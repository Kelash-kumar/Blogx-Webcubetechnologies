import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/query-client";
import { AuthProvider } from "../contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "../components/common/ErrorBoundary";

interface AppProviderProps {
    children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <Toaster 
                        position="top-right"
                        toastOptions={{
                            className: 'font-sans text-xs font-black uppercase tracking-widest border border-gray-100 rounded-2xl shadow-xl shadow-gray-100/20 px-6 py-4',
                            duration: 4000,
                        }}
                    />
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default AppProvider;
