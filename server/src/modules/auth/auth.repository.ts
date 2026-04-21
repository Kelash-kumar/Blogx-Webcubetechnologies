import User from "../user/user.model.js";
import type { IUser } from "../user/user.model.js";

export const AuthRepository = {
    findByEmail: (email: string) => {
        return User.findOne({ email });
    },

    findByUsername: (username: string) => {
        return User.findOne({ username });
    },

    findById: (id: string) => {
        return User.findById(id).select("-password");
    },

    createUser: (data: Partial<IUser>) => {
        return User.create(data);
    },

    updateRefreshToken: (userId: string, token: string | null) => {
        return User.findByIdAndUpdate(userId, { refreshToken: token });
    }
};