import { useQuery } from "@tanstack/react-query";
import { postService } from "../services/post.service";

export const usePost = (id?: string) => {
    return useQuery({
        queryKey: ["post", id],
        queryFn: () => (id ? postService.getPostById(id) : Promise.reject("No ID provided")),
        enabled: !!id,
    });
};
