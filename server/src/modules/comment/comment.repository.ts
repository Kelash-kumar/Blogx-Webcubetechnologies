import Comment from "./comment.model.js";

export const CommentRepository = {
    create: (data: any) => {
        return Comment.create(data);
    },

    findByPostId: (postId: string, skip: number, limit: number) => {
        return Comment.find({ post: postId })
            .populate("author", "name username avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    },

    countByPostId: (postId: string) => {
        return Comment.countDocuments({ post: postId });
    },

    findById: (id: string) => {
        return Comment.findById(id).populate("author", "name username avatar");
    },

    update: (id: string, content: string) => {
        return Comment.findByIdAndUpdate(id, { content }, { new: true });
    },

    delete: (id: string) => {
        return Comment.findByIdAndDelete(id);
    },
};
