import React, { useState } from "react";
import { useMyPosts, usePosts } from "../../hooks/usePosts";
import { useAuth } from "../../contexts/AuthContext";
import { 
    Search, 
    Plus, 
    Edit2, 
    Trash2, 
    Eye, 
    MoreVertical, 
    ChevronLeft, 
    ChevronRight,
    SearchX,
    Loader2,
    BookOpen,
    RefreshCcw
} from "lucide-react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PostListPage: React.FC = () => {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const isAdmin = user?.role === "admin";

    const debouncedSearch = React.useMemo(
        () => debounce((value: string) => setSearchQuery(value), 500),
        []
    );

    const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value);
        setPage(1);
    }, [debouncedSearch]);

    // Dashboard list always uses the management endpoint (which backend filters by role)
    const postsHook = useMyPosts({ page, limit: 10, search: searchQuery });

    const { posts, pagination, isLoading, refetch } = postsHook;
    const { deletePost } = usePosts();

    const handleDelete = React.useCallback(async (id: string) => {
        if (window.confirm("Delete this story?")) {
            await deletePost.mutateAsync(id);
        }
    }, [deletePost]);

    return (
        <div className="space-y-10 pb-12 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-black text-foreground tracking-tight">
                        {isAdmin ? "Global Records" : "My Articles"}
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                        {pagination?.totalItems || 0} Total entries found
                    </p>
                </div>
                <Link to="/dashboard/posts/new">
                    <Button size="sm" className="rounded-xl font-bold h-10 px-5">
                        <Plus className="w-3.5 h-3.5 mr-2" /> New Entry
                    </Button>
                </Link>
            </div>

            {/* Clean Flat Search with Refresh */}
            <div className="flex items-center gap-3">
                <div className="relative group max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 h-3.5 w-3.5" />
                    <Input 
                        type="text" 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Quick search..." 
                        className="pl-9 h-10 border-gray-100 bg-gray-50/30 rounded-xl focus:bg-white text-xs font-medium transition-all"
                    />
                </div>
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => refetch()}
                    className={`h-10 w-10 rounded-xl border-gray-100 bg-gray-50/30 hover:bg-white transition-all ${isLoading ? 'opacity-50' : ''}`}
                    disabled={isLoading}
                >
                    <RefreshCcw className={`w-3.5 h-3.5 text-muted-foreground/60 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {/* Simple Table with Proper Light Border */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-3">
                    <Loader2 className="w-5 h-5 text-primary/30 animate-spin" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Loading Database</p>
                </div>
            ) : posts.length > 0 ? (
                <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden shadow-sm shadow-gray-100/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-[9px] font-black text-muted-foreground/70 uppercase tracking-widest">Article Details</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-muted-foreground/70 uppercase tracking-widest hidden md:table-cell">Status</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-muted-foreground/70 uppercase tracking-widest hidden sm:table-cell">Created At</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-muted-foreground/70 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {posts.map((post) => (
                                    <tr key={post._id} className="group hover:bg-gray-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
                                                    {post.image ? (
                                                        <img src={post.image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <BookOpen className="w-3 h-3 text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-xs text-foreground truncate group-hover:text-primary transition-colors">{post.title}</h3>
                                                    {isAdmin && (
                                                        <span className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-tight block">By {post.author.name}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${post.status === 'published' ? 'text-green-600 bg-green-50/50 border-green-100' : 'text-amber-600 bg-amber-50/50 border-amber-100'}`}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <span className="text-[10px] font-bold text-muted-foreground/80">{dayjs(post.createdAt).format("MMM D, YYYY")}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                                                <Link to={`/posts/${post._id}`}>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                                                        <Eye className="w-3 h-3 text-muted-foreground" />
                                                    </Button>
                                                </Link>
                                                <Link to={`/dashboard/posts/edit/${post._id}`}>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                                                        <Edit2 className="w-3 h-3 text-muted-foreground" />
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleDelete(post._id)}
                                                    className="h-7 w-7 rounded-lg hover:text-red-500"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <MoreVertical className="w-3 h-3 text-gray-200 group-hover:hidden ml-auto" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Minimalist Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="px-6 py-3 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">Page {page} of {pagination.totalPages}</span>
                            <div className="flex gap-1">
                                <Button 
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-100 bg-white"
                                >
                                    Prev
                                </Button>
                                <Button 
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                    disabled={page === pagination.totalPages}
                                    className="h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-100 bg-white"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="py-24 text-center bg-gray-50/20 border border-dashed border-gray-100 rounded-2xl">
                    <SearchX className="w-8 h-8 text-gray-100 mx-auto mb-3" />
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">No matching records found</h3>
                </div>
            )}
        </div>
    );
};

export default PostListPage;
