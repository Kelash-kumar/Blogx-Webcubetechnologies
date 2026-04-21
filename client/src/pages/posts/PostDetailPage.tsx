import React from "react";
import { useParams, Link } from "react-router-dom";
import { usePost } from "../../hooks/usePost";
import { Calendar, ArrowLeft, BookOpen, Clock } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";

const PostDetailPage: React.FC = () => {
    const { id } = useParams();
    const { data: post, isLoading } = usePost(id);

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 space-y-8 animate-pulse font-sans">
                <div className="h-10 w-3/4 bg-gray-100 rounded-xl" />
                <div className="h-4 w-1/4 bg-gray-100 rounded" />
                <div className="aspect-video w-full bg-gray-100 rounded-3xl" />
            </div>
        );
    }

    if (!post) return <div className="text-center py-24 font-black text-muted-foreground uppercase tracking-widest italic">Article not found</div>;

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 pb-32 font-sans">
            <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all mb-12"
            >
                <ArrowLeft className="w-3.5 h-3.5" /> 
                Back to Feed
            </Link>

            <article className="space-y-12">
                <header className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-md">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-foreground leading-[1.15] tracking-tight">
                            {post.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6 pb-8 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-primary font-black text-sm">
                                {post.author.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-black text-foreground leading-none">{post.author.name}</p>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Publisher</p>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-gray-100" />
                        <div className="flex items-center gap-6 text-[11px] font-bold text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 opacity-50" /> {dayjs(post.createdAt).format("MMM D, YYYY")}</span>
                            <span className="hidden sm:flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 opacity-50" /> 4 min read</span>
                        </div>
                    </div>
                </header>

                {post.image && (
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-gray-50 shadow-sm">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="max-w-none">
                    <p className="text-lg text-foreground/80 leading-[1.85] font-medium whitespace-pre-wrap selection:bg-primary/20">
                        {post.content}
                    </p>
                </div>
            </article>

            <div className="mt-24 pt-12 border-t border-gray-100 text-center">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Enjoyed this story?</p>
                <Link to="/register">
                    <Button size="sm" variant="outline" className="rounded-xl px-8 h-11 font-bold">Create your own account</Button>
                </Link>
            </div>
        </div>
    );
};

export default PostDetailPage;
