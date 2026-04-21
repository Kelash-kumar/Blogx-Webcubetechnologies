import React, { useState } from "react";
import { useComments } from "../../hooks/useComments";
import { useAuth } from "../../hooks/useAuth";
import { MessageSquare, Send, Trash2, Loader2, User as UserIcon } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

dayjs.extend(relativeTime);

interface CommentSectionProps {
    postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const { user } = useAuth();
    const { comments, isLoading, addComment, deleteComment } = useComments(postId);
    const [content, setContent] = useState("");

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        await addComment.mutateAsync(content);
        setContent("");
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-foreground">Discussions</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{comments.length} Thoughts shared</p>
                    </div>
                </div>
            </div>

            {/* Input Section */}
            {user ? (
                <form onSubmit={handleAddComment} className="space-y-4 group">
                    <div className="relative border border-gray-100 rounded-[1.5rem] bg-gray-50/30 p-2 focus-within:bg-white focus-within:border-primary/20 transition-all focus-within:shadow-xl focus-within:shadow-primary/5">
                        <Textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Add your perspective..."
                            className="bg-transparent border-0 focus-visible:ring-0 min-h-[100px] text-sm font-medium resize-none px-4 py-4"
                        />
                        <div className="flex items-center justify-between px-4 pb-2">
                            <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest italic">Be kind and constructive</p>
                            <Button 
                                type="submit" 
                                disabled={addComment.isPending || !content.trim()}
                                className="rounded-full h-9 px-5 text-[10px] font-black uppercase tracking-widest"
                            >
                                {addComment.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Send className="w-3 h-3 mr-2" /> Post</>}
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="p-8 text-center bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                    <p className="text-sm font-medium text-muted-foreground mb-4">You need to be logged in to participate in the discussion.</p>
                    <Button variant="outline" className="rounded-full h-10 px-8 font-black text-[10px] uppercase tracking-widest border-gray-200" onClick={() => window.location.href = '/login'}>
                        Sign In to Comment
                    </Button>
                </div>
            )}

            {/* List Section */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-6 h-6 text-primary/30 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Syncing Conversation</p>
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-8">
                    {comments.map((comment) => (
                        <div key={comment._id} className="group relative flex gap-5">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary font-black text-xs overflow-hidden">
                                    {comment.author.avatar ? (
                                        <img src={comment.author.avatar} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon className="w-4 h-4 text-gray-200" />
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-black text-foreground">{comment.author.name}</span>
                                        <span className="mx-2 text-gray-200 text-xs">•</span>
                                        <span className="text-[10px] font-bold text-muted-foreground opacity-60">
                                            {dayjs(comment.createdAt).fromNow()}
                                        </span>
                                    </div>
                                    {user && (user.id === comment.author._id || user._id === comment.author._id) && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => deleteComment.mutate(comment._id)}
                                            className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    )}
                                </div>
                                <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center space-y-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                        <MessageSquare className="w-5 h-5 text-gray-200" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40 italic">No thoughts yet. Be the first to share.</p>
                </div>
            )}
        </div>
    );
};
