import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Post } from "../../types/post.types";
import { Image as ImageIcon, X, Tag, FileText, CheckCircle, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const postSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    status: z.enum(["draft", "published"]),
    tags: z.string().optional(),
    image: z.any().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostFormProps {
    initialData?: Post;
    onSubmit: (data: FormData) => Promise<void>;
    isLoading: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({ initialData, onSubmit, isLoading }) => {
    const [preview, setPreview] = React.useState<string | null>(initialData?.image || null);
    
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: initialData?.title || "",
            content: initialData?.content || "",
            status: initialData?.status || "draft",
            tags: initialData?.tags?.join(", ") || "",
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("image", file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onFormSubmit = async (values: PostFormValues) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("content", values.content);
        formData.append("status", values.status);
        
        if (values.tags) {
            const tagsArray = values.tags.split(",").map(tag => tag.trim()).filter(Boolean);
            tagsArray.forEach(tag => formData.append("tags", tag));
        }
        
        if (values.image instanceof File) {
            formData.append("image", values.image);
        }
        
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="font-sans max-w-4xl mx-auto">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm shadow-gray-100/50">
                {/* 1. Feature Image at Top */}
                <div className="relative aspect-[21/9] bg-gray-50 border-b border-gray-100 group">
                    {preview ? (
                        <>
                            <img src={preview} alt="Featured" className="w-full h-full object-cover" />
                            <button 
                                type="button"
                                onClick={() => { setPreview(null); setValue("image", null); }}
                                className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-100/50 transition-all">
                            <div className="p-4 bg-white rounded-2xl shadow-sm mb-3">
                                <ImageIcon className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Add Featured Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    )}
                </div>

                <div className="p-10 md:p-14 space-y-10">
                    {/* 2. Title */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Headline</label>
                        <Input 
                            {...register("title")}
                            className={`text-3xl md:text-4xl font-black h-auto py-4 bg-transparent border-0 border-b border-gray-100 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-all placeholder:text-gray-200 ${errors.title ? 'border-destructive' : ''}`}
                            placeholder="Your story title..."
                        />
                        {errors.title && <p className="text-[11px] text-destructive font-bold ml-1">{errors.title.message}</p>}
                    </div>

                    {/* 3. Story / Content */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">The Narrative</label>
                        <Textarea 
                            {...register("content")}
                            rows={12}
                            className={`bg-transparent border-0 border-b border-gray-100 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-all text-lg font-medium leading-relaxed resize-none placeholder:text-gray-200 ${errors.content ? 'border-destructive' : ''}`}
                            placeholder="Once upon a time..."
                        />
                        {errors.content && <p className="text-[11px] text-destructive font-bold ml-1">{errors.content.message}</p>}
                    </div>

                    {/* 4. Tags in One Row */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Tag className="w-3 h-3" /> Categorization
                        </label>
                        <div className="relative group">
                            <Input 
                                {...register("tags")}
                                className="bg-gray-50/50 border-gray-100 rounded-2xl h-12 pl-10 focus:bg-white text-sm font-bold"
                                placeholder="tech, news, design (separated by commas)"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                                <span className="font-bold text-sm">#</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Options Row at Bottom */}
                <div className="border-t border-gray-100 p-8 md:px-14 flex flex-col sm:flex-row items-center justify-end gap-4">
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => setValue("status", "draft")}
                            className="flex-1 sm:flex-none h-12 px-8 rounded-xl font-bold border-gray-200 bg-white hover:bg-gray-50 transition-all"
                        >
                            Save as Draft
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            onClick={() => setValue("status", "published")}
                            className="flex-1 sm:flex-none h-12 px-10 rounded-xl font-black shadow-lg shadow-primary/20 transition-all"
                        >
                            {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                            Publish Article
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};
