import React from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts";
import { PostForm } from "../../components/posts/PostForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const CreatePostPage: React.FC = () => {
    const navigate = useNavigate();
    const { createPost } = usePosts();

    const handleSubmit = async (formData: FormData) => {
        const loadingToast = toast.loading("Saving your story...");
        try {
            await createPost.mutateAsync(formData);
            toast.success("Article created successfully!", { id: loadingToast });
            navigate("/dashboard/posts");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create article.", { id: loadingToast });
            console.error("Failed to create post", error);
        }
    };

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
                    <h1 className="text-2xl font-black text-foreground tracking-tight">Draft New Article</h1>
                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground italic">Start your next masterpiece</p>
                </div>
            </div>

            <div className="max-w-3xl">
                <PostForm onSubmit={handleSubmit} isLoading={createPost.isPending} />
            </div>
        </div>
    );
};

export default CreatePostPage;
