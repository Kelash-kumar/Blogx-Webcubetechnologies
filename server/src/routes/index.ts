import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import postRoutes from "../modules/post/post.routes.js";
import commentRoutes from "../modules/comment/comment.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);

export default router;