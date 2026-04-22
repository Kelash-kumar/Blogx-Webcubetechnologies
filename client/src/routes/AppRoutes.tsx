import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageLoader from "../components/common/PageLoader";
import { PublicLayout } from "../components/layouts/PublicLayout";
import { DashboardLayout } from "../components/layouts/DashboardLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

// Lazy Pages
const HomePage = lazy(() => import("../pages/HomePage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const DashboardHome = lazy(() => import("../pages/dashboard/DashboardHome"));
const PostListPage = lazy(() => import("../pages/posts/PostListPage"));
const CreatePostPage = lazy(() => import("../pages/posts/CreatePostPage"));
const EditPostPage = lazy(() => import("../pages/posts/EditPostPage"));
const PostDetailPage = lazy(() => import("../pages/posts/PostDetailPage"));

const AppRoutes: React.FC = () => {
    return (
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
    );
};

export default AppRoutes;
