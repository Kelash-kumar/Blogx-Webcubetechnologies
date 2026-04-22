import { MessageSquare, Send, Trash2, Loader2, User as UserIcon, CornerDownRight, Reply as ReplyIcon } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useComments } from "@/hooks/useComments";
import { useState } from "react";

dayjs.extend(relativeTime);

interface Comment {
    _id: string;
    content: string;
    author: {
        _id: string;
        name: string;
        avatar?: string;
    };
    parentComment: string | null;
    createdAt: string;
}

interface CommentSectionProps {
    postId: string;
}

const CommentItem: React.FC<{
    comment: Comment;
    allComments: Comment[];
    user: any;
    onReply: (parentId: string, content: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    isPending: boolean;
    level?: number;
}> = ({ comment, allComments, user, onReply, onDelete, isPending, level = 0 }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    
    const replies = allComments.filter(c => c.parentComment === comment._id);
    const hasReplies = replies.length > 0;

    const handleReplySubmit = async () => {
        if (!replyContent.trim()) return;
        await onReply(comment._id, replyContent);
        setReplyContent("");
        setIsReplying(false);
    };

    return (
        <div className={cn("space-y-4", level > 0 && "mt-6 ml-4 md:ml-10 relative")}>
            {/* Thread Line */}
            {level > 0 && (
                <div className="absolute -left-6 md:-left-8 top-0 bottom-0 w-px bg-gray-100">
                    <div className="absolute top-5 left-0 w-4 md:w-6 h-px bg-gray-100" />
                </div>
            )}

            <div className="group relative flex gap-4 md:gap-5">
                <div className="flex-shrink-0 relative z-10">
                    <div className={cn(
                        "rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary font-black overflow-hidden",
                        level === 0 ? "w-10 h-10 text-xs" : "w-8 h-8 text-[10px]"
                    )}>
                        {comment.author.avatar ? (
                            <img src={comment.author.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className={cn(level === 0 ? "w-4 h-4" : "w-3 h-3", "text-gray-200")} />
                        )}
                    </div>
                </div>
                
                <div className="flex-1 space-y-2 bg-gray-50/20 p-4 rounded-3xl border border-transparent hover:border-gray-100 hover:bg-white transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-black text-foreground">{comment.author.name}</span>
                            <span className="mx-2 text-gray-200 text-xs">•</span>
                            <span className="text-[10px] font-bold text-muted-foreground opacity-60">
                                {dayjs(comment.createdAt).fromNow()}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {user && (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setIsReplying(!isReplying)}
                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                >
                                    <ReplyIcon className="w-3.5 h-3.5" />
                                </Button>
                            )}
                            {user && (user.id === comment.author._id || user._id === comment.author._id) && (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => onDelete(comment._id)}
                                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                        {comment.content}
                    </p>
                </div>
            </div>

            {/* Reply Input */}
            {isReplying && (
                <div className="ml-14 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <Textarea 
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Replying to ${comment.author.name}...`}
                        className="min-h-[80px] rounded-2xl border-gray-100 text-xs font-medium focus-visible:ring-primary/20"
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)} className="rounded-full text-[10px] font-black uppercase tracking-widest">Cancel</Button>
                        <Button 
                            size="sm" 
                            onClick={handleReplySubmit}
                            disabled={isPending || !replyContent.trim()}
                            className="rounded-full px-5 text-[10px] font-black uppercase tracking-widest"
                        >
                            {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Reply"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Recursive Replies */}
            {hasReplies && (
                <div className="space-y-2">
                    {replies.map(reply => (
                        <CommentItem 
                            key={reply._id} 
                            comment={reply} 
                            allComments={allComments}
                            user={user}
                            onReply={onReply}
                            onDelete={onDelete}
                            isPending={isPending}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const { user } = useAuth();
    const { comments, isLoading, addComment, deleteComment } = useComments(postId);
    const [content, setContent] = useState("");

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        await addComment.mutateAsync({ content });
        setContent("");
    };

    const handleReply = async (parentCommentId: string, replyContent: string) => {
        await addComment.mutateAsync({ content: replyContent, parentCommentId });
    };

    const topLevelComments = (comments as Comment[]).filter(c => !c.parentComment);

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

            {/* Main Input Section */}
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
            ) : topLevelComments.length > 0 ? (
                <div className="space-y-10">
                    {topLevelComments.map((comment) => (
                        <CommentItem 
                            key={comment._id} 
                            comment={comment} 
                            allComments={comments as Comment[]}
                            user={user}
                            onReply={handleReply}
                            onDelete={(id) => deleteComment.mutateAsync(id)}
                            isPending={addComment.isPending}
                        />
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
