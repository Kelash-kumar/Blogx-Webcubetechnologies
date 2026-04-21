import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        content: {
            type: String,
            required: true,
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
            index: true,
        },

        tags: {
            type: [String],
            default: [],
            index: true,
        },
        image: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// 🔥 Text index for search
postSchema.index({ title: "text", tags: "text" });

export default mongoose.model("Post", postSchema);