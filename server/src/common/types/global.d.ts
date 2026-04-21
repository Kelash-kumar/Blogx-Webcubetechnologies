import { IUser } from "../../modules/user/user.model.js";

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                role: "admin" | "author";
            };
            file?: Multer.File;
            files?: { [fieldname: string]: Multer.File[] } | Multer.File[];
        }
    }
}

export {};
