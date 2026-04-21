import React, { useState } from "react";
import { usePosts } from "../hooks/usePosts";
import { useDebounce } from "../hooks/useDebounce";
import { Search, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const HomePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { posts, isLoading } = usePosts({ search: debouncedSearch, limit: 9 });

    return (
        <div className="space-y-24 pb-20 font-sans">
            {/* Elegant Hero Section */}
            <section className="relative pt-20 pb-10">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full mb-8">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">Curated Insights</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-8">
                        Pure content. <br />
                        <span className="text-muted-foreground/60 font-medium">Simple discovery.</span>
                    </h1>
                    
                    {/* Minimalist Search */}
                    <div className="max-w-md mx-auto relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 h-11 bg-gray-50 border border-gray-100/50 rounded-xl focus:bg-white transition-all text-xs font-medium outline-none focus:ring-2 focus:ring-primary/5"
                            placeholder="Find a story..."
                        />
                    </div>
                </div>
            </section>

            {/* Articles Feed */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-12">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">The Latest</span>
                    <div className="h-px w-full bg-gray-100" />
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="space-y-4 animate-pulse">
                                <div className="aspect-[16/10] bg-gray-50 rounded-2xl" />
                                <div className="h-4 w-3/4 bg-gray-50 rounded-lg" />
                                <div className="h-3 w-full bg-gray-50 rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                        {posts.map((post) => (
                            <article key={post._id} className="group flex flex-col h-full">
                                <Link 
                                    to={`/posts/${post._id}`} 
                                    className="block relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-gray-50 transition-all duration-500"
                                >
                                    {post.image ? (
                                        <img 
                                            src={post.image} 
                                            alt={post.title} 
                                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-30">
                                            <BookOpen className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-primary shadow-sm border border-white/20">
                                            {post.tags[0] || 'Story'}
                                        </span>
                                    </div>
                                </Link>
                                
                                <div className="flex items-center gap-2.5 text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-4">
                                    <span className="flex items-center gap-1">{dayjs(post.createdAt).format("MMM D")}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-200" />
                                    <span>By {post.author.name}</span>
                                </div>

                                <Link to={`/posts/${post._id}`} className="flex-1">
                                    <h3 className="text-lg font-black text-foreground leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed mb-6 opacity-80">
                                        {post.content}
                                    </p>
                                </Link>
                                
                                <Link 
                                    to={`/posts/${post._id}`}
                                    className="inline-flex items-center gap-1.5 text-primary text-[9px] font-black uppercase tracking-[0.2em] group-hover:gap-2.5 transition-all"
                                >
                                    Read Story <ArrowRight className="w-3 h-3" />
                                </Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest italic opacity-40">Silence. No stories found.</h3>
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;
