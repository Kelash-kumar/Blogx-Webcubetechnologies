import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { upload } from "../../common/middlewares/upload.middleware.js";
import * as PostController from "./post.controller.js";
import * as PostValidation from "./post.validation.js";

const router = Router();

router.get(
    "/",
    validate(PostValidation.postQuerySchema),
    PostController.getPosts
);

router.get("/:id", PostController.getPost);

// Protected routes
router.use(authenticate);

router.post(
    "/",
    upload.single("image"),
    validate(PostValidation.createPostSchema),
    PostController.createPost
);

router.patch(
    "/:id",
    upload.single("image"),
    validate(PostValidation.updatePostSchema),
    PostController.updatePost
);

router.delete("/:id", PostController.deletePost);

export default router;
