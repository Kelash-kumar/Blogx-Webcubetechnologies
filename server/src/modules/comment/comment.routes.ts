import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import * as CommentController from "./comment.controller.js";
import * as CommentValidation from "./comment.validation.js";

const router = Router();

// Public route: Get comments for a post
router.get(
    "/post/:postId",
    validate(CommentValidation.commentQuerySchema),
    CommentController.getPostComments
);

// Protected routes
router.use(authenticate);

router.post(
    "/",
    validate(CommentValidation.createCommentSchema),
    CommentController.addComment
);

router.patch(
    "/:id",
    validate(CommentValidation.updateCommentSchema),
    CommentController.updateComment
);

router.delete("/:id", CommentController.deleteComment);

export default router;
