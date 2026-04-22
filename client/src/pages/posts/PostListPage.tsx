import React, { useState } from "react";
import { useMyPosts, usePosts } from "../../hooks/usePosts";
import { useAuth } from "../../contexts/AuthContext";
import { 
    Search, 
    Plus, 
    Edit2, 
    Trash2, 
    Eye, 
    SearchX,
    Loader2,
    BookOpen,
    RefreshCcw,
    ArrowUpDown
} from "lucide-react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import { cn } from "@/lib/utils";

const PostListPage: React.FC = () => {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [status, setStatus] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("createdAt");
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    
    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

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

    // Dashboard list always uses the management endpoint
    const postsHook = useMyPosts({ 
        page, 
        limit: 10, 
        search: searchQuery, 
        status: status || undefined,
        sortBy,
        order
    });

    const { posts, pagination, isLoading, refetch } = postsHook;
    const { deletePost } = usePosts();

    const handleDeleteClick = (id: string) => {
        setPostToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (postToDelete) {
            await deletePost.mutateAsync(postToDelete);
            setIsDeleteModalOpen(false);
            setPostToDelete(null);
        }
    };

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

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative group max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 h-3.5 w-3.5" />
                    <Input 
                        type="text" 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search title..." 
                        className="pl-9 h-10 border-gray-100 bg-gray-50/30 rounded-xl focus:bg-white text-xs font-medium transition-all"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <select 
                        value={status} 
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        className="h-10 px-3 bg-gray-50/30 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white transition-all"
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Drafts</option>
                    </select>

                    <select 
                        value={sortBy} 
                        onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                        className="h-10 px-3 bg-gray-50/30 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white transition-all"
                    >
                        <option value="createdAt">Date Created</option>
                        <option value="title">Alphabetical</option>
                        <option value="status">By Status</option>
                    </select>

                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setOrder(o => o === "asc" ? "desc" : "asc")}
                        title={order === 'asc' ? "Sort Descending" : "Sort Ascending"}
                        className="h-10 w-10 rounded-xl border-gray-100 bg-gray-50/30 hover:bg-white transition-all"
                    >
                        <ArrowUpDown className={`w-3.5 h-3.5 text-muted-foreground/60 ${order === 'asc' ? 'rotate-180' : ''} transition-transform duration-300`} />
                    </Button>

                    <div className="w-px h-6 bg-gray-100 mx-1" />

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
            </div>

            {/* Simple Table with Proper Light Border */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-3">
                    <Loader2 className="w-5 h-5 text-primary/30 animate-spin" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Loading Database</p>
                </div>
            ) : posts.length > 0 ? (
                <div className="border border-gray-100 rounded-[2rem] bg-white overflow-hidden shadow-sm shadow-gray-100/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/30 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Article Portfolio</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] hidden md:table-cell text-center">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] hidden sm:table-cell text-center">Timeline</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] text-right">Management</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {posts.map((post) => (
                                    <tr key={post._id} className="group hover:bg-gray-50/20 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
                                                        {post.image ? (
                                                            <img src={post.image} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <BookOpen className="w-5 h-5 text-gray-200" />
                                                        )}
                                                    </div>
                                                    {post.status === 'published' && (
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 space-y-1">
                                                    <h3 className="font-black text-sm text-foreground truncate group-hover:text-primary transition-colors tracking-tight">
                                                        {post.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        {isAdmin && (
                                                            <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md">
                                                                {post.author.name}
                                                            </span>
                                                        )}
                                                        <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">
                                                            ID: {post._id.slice(-6)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 hidden md:table-cell">
                                            <div className="flex justify-center">
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full border flex items-center gap-2",
                                                    post.status === 'published' 
                                                        ? 'text-green-600 bg-green-50/30 border-green-100/50' 
                                                        : 'text-amber-600 bg-amber-50/30 border-amber-100/50'
                                                )}>
                                                    <div className={cn("w-1 h-1 rounded-full", post.status === 'published' ? 'bg-green-500 animate-pulse' : 'bg-amber-500')} />
                                                    {post.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 hidden sm:table-cell">
                                            <div className="flex flex-col items-center justify-center space-y-0.5">
                                                <span className="text-[11px] font-black text-foreground/80">{dayjs(post.createdAt).format("MMM D")}</span>
                                                <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">{dayjs(post.createdAt).format("YYYY")}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="flex items-center gap-1 bg-gray-50/50 p-1 rounded-xl border border-transparent group-hover:border-gray-100 group-hover:bg-white transition-all duration-500">
                                                    <Link to={`/posts/${post._id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </Link>
                                                    <Link to={`/dashboard/posts/edit/${post._id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </Link>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => handleDeleteClick(post._id)}
                                                        className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
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

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={deletePost.isPending}
            />
        </div>
    );
};

export default PostListPage;
