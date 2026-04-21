import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "author";
    username: string;
    bio: string;
    avatar: string;
    isActive: boolean;
    isDeleted: boolean;
    refreshToken: string;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: { type: String, required: true },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "author"],
            default: "author",
        },
        bio: { type: String, default: "" },
        avatar: { type: String, default: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        refreshToken: { type: String }
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);