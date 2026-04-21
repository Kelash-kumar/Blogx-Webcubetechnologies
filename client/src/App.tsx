import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { Loader2 } from "lucide-react";

// Layouts
import { PublicLayout } from "./components/layouts/PublicLayout";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Lazy Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const PostListPage = lazy(() => import("./pages/posts/PostListPage"));
const CreatePostPage = lazy(() => import("./pages/posts/CreatePostPage"));
const EditPostPage = lazy(() => import("./pages/posts/EditPostPage"));
const PostDetailPage = lazy(() => import("./pages/posts/PostDetailPage"));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

// Loading Component
const PageLoader = () => (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white font-sans">
        <Loader2 className="w-8 h-8 text-primary/30 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Initializing App</p>
    </div>
);

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <ErrorBoundary>
                        <Suspense fallback={<PageLoader />}>
                            <Routes>
                                {/* Public Routes */}
                                <Route element={<PublicLayout />}>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/about" element={<AboutPage />} />
                                    <Route path="/posts/:id" element={<PostDetailPage />} />
                                </Route>

                                {/* Auth Routes */}
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/unauthorized" element={<div className="h-screen flex items-center justify-center font-black text-4xl text-gray-300 uppercase tracking-widest">Unauthorized</div>} />

                                {/* Dashboard Routes (Protected) */}
                                <Route 
                                    path="/dashboard" 
                                    element={
                                        <ProtectedRoute>
                                            <DashboardLayout />
                                        </ProtectedRoute>
                                    }
                                >
                                    <Route index element={<DashboardHome />} />
                                    <Route path="posts" element={<PostListPage />} />
                                    <Route path="posts/new" element={<CreatePostPage />} />
                                    <Route path="posts/edit/:id" element={<EditPostPage />} />
                                </Route>

                                {/* Fallback */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </Suspense>
                    </ErrorBoundary>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
