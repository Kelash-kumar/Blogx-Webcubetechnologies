import React from "react";
import { usePosts } from "../../hooks/usePosts";
import { useAuth } from "../../contexts/AuthContext";
import { 
    FileText, 
    CheckCircle, 
    Clock, 
    Plus,
    ArrowUpRight,
    PenTool
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DashboardHome: React.FC = () => {
    const { user } = useAuth();
    const { stats, isLoading } = usePosts();

    const isAdmin = user?.role === "admin";

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-6 w-32 bg-gray-100 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl"></div>)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-foreground tracking-tight">
                        {isAdmin ? "Admin Overview" : "Creator Center"}
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        Welcome back, <span className="text-foreground font-bold">{user?.name}</span>.
                    </p>
                </div>
                <Link to="/dashboard/posts/new">
                    <Button size="sm" className="rounded-xl font-bold h-11 px-6 shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" /> Write Story
                    </Button>
                </Link>
            </div>

            {/* Simple Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Articles", value: stats?.totalPosts || 0, icon: FileText, color: "text-primary", bg: "bg-primary/5" },
                    { label: "Published", value: stats?.publishedPosts || 0, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
                    { label: "Drafts", value: stats?.draftPosts || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" }
                ].map((stat, i) => (
                    <Card key={i} className="border-gray-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black text-foreground">{stat.value}</p>
                            </div>
                            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Minimal CTA Card */}
                <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-gray-50/50">
                    <CardContent className="p-8 space-y-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                            <PenTool className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-foreground">Ready to inspire?</h3>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-sm">
                                Create your next masterpiece. Your drafts are saved automatically so you can pick up where you left off.
                            </p>
                        </div>
                        <Link to="/dashboard/posts/new" className="inline-block">
                            <Button variant="outline" size="sm" className="rounded-xl font-bold h-10 border-gray-200">
                                Open Editor <ArrowUpRight className="w-3.5 h-3.5 ml-2 opacity-50" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Simplified Tips */}
                <Card className="rounded-[2rem] border-gray-100 shadow-sm">
                    <CardContent className="p-8">
                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">
                            Platform Updates
                        </h3>
                        <ul className="space-y-4">
                            {[
                                "New 'Clear Text' editor mode launched.",
                                "Improved image compression for faster loading.",
                                "SEO meta-tags are now auto-generated.",
                                "Draft autosave frequency increased."
                            ].map((tip, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                                    <div className="w-1 h-1 rounded-full bg-primary" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                        <div className="pt-8">
                            <Link to="/" className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                                View Live Feed →
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardHome;
