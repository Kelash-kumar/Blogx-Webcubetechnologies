import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts";
import { usePost } from "../../hooks/usePost";
import { PostForm } from "../../components/posts/PostForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const EditPostPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { updatePost } = usePosts();
    const { data: post, isLoading } = usePost(id);

    const handleSubmit = async (formData: FormData) => {
        if (!id) return;
        const loadingToast = toast.loading("Updating your article...");
        try {
            await updatePost.mutateAsync({ id, formData });
            toast.success("Changes saved successfully!", { id: loadingToast });
            navigate("/dashboard/posts");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update article.", { id: loadingToast });
            console.error("Failed to update post", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 font-sans">
                <Loader2 className="w-8 h-8 text-primary/40 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Retrieving Content...</p>
            </div>
        );
    }

    if (!post) return <div className="text-center py-20 font-black text-muted-foreground uppercase tracking-widest italic">Article not found</div>;

    return (
        <div className="space-y-10 pb-12 font-sans">
            <div className="flex items-center gap-6">
                <Button 
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="h-10 w-10 rounded-xl border-gray-100 bg-white"
                >
                    <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </Button>
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-foreground tracking-tight">Refine Article</h1>
                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground italic">Perfecting your story</p>
                </div>
            </div>

            <PostForm initialData={post} onSubmit={handleSubmit} isLoading={updatePost.isPending} />
        </div>
    );
};

export default EditPostPage;
