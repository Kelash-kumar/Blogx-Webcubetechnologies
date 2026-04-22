import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Layout, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PublicLayout: React.FC = () => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-primary p-1.5 rounded-lg shadow-sm group-hover:rotate-6 transition-transform">
                                <Layout className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-foreground">
                                Blog<span className="text-primary">X</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Articles</Link>
                            <Link to="/about" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">About</Link>
                            
                            <div className="w-px h-4 bg-gray-200 mx-2" />

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/dashboard/posts/new" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        Write Story
                                    </Link>
                                    <Link to="/dashboard">
                                        <Button variant="default" size="sm" className="rounded-full font-bold px-5">
                                            Dashboard
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login">
                                        <Button variant="ghost" size="sm" className="font-bold text-muted-foreground hover:text-foreground">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button size="sm" className="rounded-full font-bold px-5 shadow-md shadow-primary/10">
                                            Join Free
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 p-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-300">
                        <Link to="/" className="block text-lg font-bold text-foreground">Articles</Link>
                        <Link to="/about" className="block text-lg font-bold text-foreground">About</Link>
                        <hr className="border-gray-50" />
                        {user ? (
                            <div className="space-y-3">
                                <Link to="/dashboard/posts/new" className="block">
                                    <Button variant="outline" className="w-full rounded-xl py-6 font-bold text-lg">Write Story</Button>
                                </Link>
                                <Link to="/dashboard" className="block">
                                    <Button className="w-full rounded-xl py-6 font-bold text-lg">Dashboard</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/login">
                                    <Button variant="outline" className="w-full rounded-xl py-6 font-bold">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="w-full rounded-xl py-6 font-bold">Join</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2 opacity-50">
                            <Layout className="w-4 h-4" />
                            <span className="font-bold text-sm tracking-tight text-foreground">BlogX</span>
                        </div>
                        <p className="text-muted-foreground text-sm font-medium">© 2026 BlogX. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">Twitter</a>
                            <a href="#" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">GitHub</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
