import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const createCommentSchema = {
    params: Joi.object({
        postId: Joi.string().pattern(objectIdPattern),
    }),
    body: Joi.object({
        content: Joi.string().trim().min(1).max(500).required(),
        postId: Joi.string().pattern(objectIdPattern),
        parentCommentId: Joi.string().pattern(objectIdPattern).optional(),
    }),
};

export const updateCommentSchema = {
    params: Joi.object({
        id: Joi.string().pattern(objectIdPattern).required(),
    }),
    body: Joi.object({
        content: Joi.string().trim().min(1).max(500).required(),
    }),
};

export const commentQuerySchema = {
    params: Joi.object({
        postId: Joi.string().pattern(objectIdPattern).required(),
    }),
    query: Joi.object({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
    }),
};
