import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "../services/comment.service";
import toast from "react-hot-toast";

export const useComments = (postId: string, page = 1) => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["comments", postId, page],
        queryFn: () => commentService.getCommentsByPost(postId, page),
        enabled: !!postId,
    });

    const addComment = useMutation({
        mutationFn: ({ content, parentCommentId }: { content: string, parentCommentId?: string }) => 
            commentService.addComment(postId, content, parentCommentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            toast.success("Comment posted!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to post comment.");
        }
    });

    const deleteComment = useMutation({
        mutationFn: (commentId: string) => commentService.deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            toast.success("Comment deleted.");
        }
    });

    return {
        comments: data?.data || [],
        pagination: data?.pagination,
        isLoading,
        isError,
        addComment,
        deleteComment
    };
};
