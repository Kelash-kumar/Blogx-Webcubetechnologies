import React from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Layout, LogOut, Plus, BookOpen, BarChart3, User as UserIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const DashboardLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const navItems = [
        { icon: BarChart3, label: "Overview", path: "/dashboard" },
        { icon: BookOpen, label: "Articles", path: "/dashboard/posts" },
        { icon: Plus, label: "Write", path: "/dashboard/posts/new" },
    ];

    return (
        <div className="flex h-screen bg-white overflow-hidden font-sans">
            {/* Minimal Sidebar */}
            <aside className="w-64 border-r border-gray-100 flex flex-col bg-gray-50/30">
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary p-1.5 rounded-lg">
                            <Layout className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-foreground">
                            BlogX
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-3 space-y-1 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path}
                                to={item.path} 
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-sm",
                                    isActive 
                                        ? "bg-primary text-primary-foreground shadow-sm" 
                                        : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto space-y-4">
                    <div className="px-4 py-3 bg-white border border-gray-100 rounded-2xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-black text-foreground truncate">{user?.name}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground truncate">{user?.role}</p>
                        </div>
                    </div>
                    
                    <Button 
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start gap-3 px-4 py-2 rounded-xl text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-all font-bold text-xs"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Dashboard</span>
                        <span className="text-gray-300">/</span>
                        <span className="text-[10px] font-black text-foreground uppercase tracking-widest">
                            {navItems.find(item => item.path === location.pathname)?.label || 'Overview'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground">
                            <Settings className="w-4 h-4" />
                        </Button>
                        <div className="w-px h-4 bg-gray-100 mx-1" />
                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto bg-white p-8">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
