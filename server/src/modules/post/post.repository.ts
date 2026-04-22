import Post from "./post.model.js";

export const PostRepository = {
    create: (data: any) => {
        return Post.create(data);
    },

    findAll: (filter: any, skip: number, limit: number, sortBy: string = "createdAt", order: number = -1) => {
        return Post.find(filter)
            .populate("author", "name username avatar")
            .sort({ [sortBy]: order as any })
            .skip(skip)
            .limit(limit);
    },

    count: (filter: any) => {
        return Post.countDocuments(filter);
    },

    findById: (id: string) => {
        return Post.findById(id).populate("author", "name username avatar");
    },

    update: (id: string, data: any) => {
        return Post.findByIdAndUpdate(id, data, { new: true });
    },

    delete: (id: string) => {
        return Post.findByIdAndDelete(id);
    },

    getStats: async (filter: any = {}) => {
        return Post.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalPosts: { $sum: 1 },
                    publishedPosts: {
                        $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
                    },
                    draftPosts: {
                        $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ]);
    },
};
