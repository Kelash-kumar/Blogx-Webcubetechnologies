import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { upload } from "../../common/middlewares/upload.middleware.js";
import * as PostController from "./post.controller.js";
import * as PostValidation from "./post.validation.js";
import * as CommentController from "../comment/comment.controller.js";
import * as CommentValidation from "../comment/comment.validation.js";

const router = Router();

// Public routes
router.get(
    "/",
    validate(PostValidation.postQuerySchema),
    PostController.getPosts
);

router.get("/stats", authenticate, PostController.getPostStats);

router.get(
    "/my",
    authenticate,
    validate(PostValidation.postQuerySchema),
    PostController.getMyPosts
);

router.get("/:id", PostController.getPost);

// Comment routes (nested under posts)
router.get(
    "/:postId/comments",
    validate(CommentValidation.commentQuerySchema),
    CommentController.getPostComments
);

router.use(authenticate);

router.post(
    "/",
    upload.single("image"),
    validate(PostValidation.createPostSchema),
    PostController.createPost
);

router.put(
    "/:id",
    upload.single("image"),
    validate(PostValidation.updatePostSchema),
    PostController.updatePost
);

router.patch(
    "/:id/status",
    validate(PostValidation.updatePostStatusSchema),
    PostController.updatePostStatus
);

router.delete("/:id", PostController.deletePost);

// Add comment to post
router.post(
    "/:postId/comments",
    validate(CommentValidation.createCommentSchema),
    CommentController.addComment
);

export default router;
