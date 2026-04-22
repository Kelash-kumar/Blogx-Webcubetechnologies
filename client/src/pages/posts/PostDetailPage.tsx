import React from "react";
import { useParams, Link } from "react-router-dom";
import { usePost } from "../../hooks/usePost";
import { Calendar, ArrowLeft, Clock, Share2, Bookmark } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { CommentSection } from "../../components/posts/CommentSection";
import { useAuth } from "../../contexts/AuthContext";

const PostDetailPage: React.FC = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { data: post, isLoading } = usePost(id);

    if (isLoading) {
        return (
            <div className="max-w-screen-md mx-auto px-6 py-24 space-y-12 animate-pulse font-sans">
                <div className="space-y-4">
                    <div className="h-4 w-20 bg-gray-50 rounded" />
                    <div className="h-12 w-full bg-gray-50 rounded-2xl" />
                    <div className="h-4 w-1/3 bg-gray-50 rounded" />
                </div>
                <div className="aspect-[16/9] w-full bg-gray-50 rounded-[2.5rem]" />
                <div className="space-y-4">
                    <div className="h-4 w-full bg-gray-50 rounded" />
                    <div className="h-4 w-full bg-gray-50 rounded" />
                    <div className="h-4 w-2/3 bg-gray-50 rounded" />
                </div>
            </div>
        );
    }

    if (!post) return <div className="text-center py-32 font-black text-muted-foreground uppercase tracking-[0.3em] italic opacity-40">Article not found</div>;

    return (
        <div className="font-sans bg-white min-h-screen selection:bg-primary/10">
            {/* Top Navigation */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-50 px-6 py-4">
                <div className="max-w-screen-md mx-auto flex items-center justify-between">
                    <Link 
                        to="/" 
                        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> 
                        Back to Stories
                    </Link>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary">
                            <Share2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary">
                            <Bookmark className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            <article className="max-w-screen-md mx-auto px-6 py-16 md:py-24">
                {/* Header Section */}
                <header className="space-y-10 mb-16">
                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="text-[9px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[1.1] tracking-tight">
                            {post.title}
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary font-black text-sm shadow-sm">
                                {post.author.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-black text-foreground leading-none">{post.author.name}</p>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                    <Clock className="w-3 h-3 opacity-40" /> 4 Min Read
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            <Calendar className="w-3.5 h-3.5 opacity-40" />
                            {dayjs(post.createdAt).format("MMMM D, YYYY")}
                        </div>
                    </div>
                </header>

                {/* Hero Image */}
                {post.image && (
                    <div className="relative aspect-[16/10] md:aspect-[21/10] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-gray-50 mb-20 shadow-2xl shadow-gray-200/50">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Main Content */}
                <div className="max-w-none">
                    <p className="text-lg md:text-xl text-foreground/80 leading-[1.9] font-medium whitespace-pre-wrap selection:bg-primary/20">
                        {post.content}
                    </p>
                </div>

                {/* Discussions Section */}
                <div className="mt-32">
                    <CommentSection postId={post._id} />
                </div>

                {/* Footer Section */}
                {!user && (
                    <footer className="mt-24 pt-16 border-t border-gray-100">
                        <div className="bg-gray-50/50 rounded-[2.5rem] p-8 md:p-12 text-center space-y-8">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Continue Exploring</p>
                                <h3 className="text-2xl font-black text-foreground">Join the BlogX Community</h3>
                                <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto">
                                    Subscribe to discover more thought-provoking stories and insights from our community of writers.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/register">
                                    <Button className="rounded-full px-10 h-12 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">Create Account</Button>
                                </Link>
                                <Link to="/">
                                    <Button variant="outline" className="rounded-full px-10 h-12 font-black text-xs uppercase tracking-widest border-gray-200">Return to Feed</Button>
                                </Link>
                            </div>
                        </div>
                    </footer>
                )}
            </article>
        </div>
    );
};

export default PostDetailPage;
