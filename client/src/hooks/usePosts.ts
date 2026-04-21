import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postService, type PostFilters } from "../services/post.service";

export const usePosts = (filters: PostFilters = {}) => {
    const queryClient = useQueryClient();

    // Fetch posts
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["posts", filters],
        queryFn: () => postService.getPosts(filters),
    });

    // Fetch stats
    const { data: stats } = useQuery({
        queryKey: ["post-stats"],
        queryFn: () => postService.getStats(),
    });

    // Create post mutation
    const createPost = useMutation({
        mutationFn: (formData: FormData) => postService.createPost(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["my-posts"] });
            queryClient.invalidateQueries({ queryKey: ["post-stats"] });
        },
    });

    // Update post mutation
    const updatePost = useMutation({
        mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
            postService.updatePost(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["my-posts"] });
            queryClient.invalidateQueries({ queryKey: ["post-stats"] });
        },
    });

    // Delete post mutation
    const deletePost = useMutation({
        mutationFn: (id: string) => postService.deletePost(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["my-posts"] });
            queryClient.invalidateQueries({ queryKey: ["post-stats"] });
        },
    });

    return {
        posts: data?.data || [],
        pagination: data?.pagination,
        stats,
        isLoading,
        isError,
        refetch,
        createPost,
        updatePost,
        deletePost,
    };
};

export const useMyPosts = (filters: PostFilters = {}) => {
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["my-posts", filters],
        queryFn: () => postService.getMyPosts(filters),
    });

    return {
        posts: data?.data || [],
        pagination: data?.pagination,
        isLoading,
        isError,
        refetch,
    };
};
