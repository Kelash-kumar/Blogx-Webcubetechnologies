import Joi from "joi";

export const createPostSchema = {
    body: Joi.object({
        title: Joi.string().trim().min(5).max(200).required(),
        content: Joi.string().min(10).required(),
        tags: Joi.array().items(Joi.string()).single().default([]),
        status: Joi.string().valid("draft", "published").default("draft"),
        image: Joi.string().allow(""),
    }),
};

export const updatePostSchema = {
    params: Joi.object({
        id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    }),
    body: Joi.object({
        title: Joi.string().trim().min(5).max(200),
        content: Joi.string().min(10),
        tags: Joi.array().items(Joi.string()).single(),
        status: Joi.string().valid("draft", "published"),
        image: Joi.string().allow(""),
    }).min(1),
};

export const updatePostStatusSchema = {
    params: Joi.object({
        id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    }),
    body: Joi.object({
        status: Joi.string().valid("draft", "published").required(),
    }),
};

export const postQuerySchema = {
    query: Joi.object({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
        search: Joi.string().allow(""),
        status: Joi.string().valid("draft", "published"),
        tags: Joi.string(),
    }),
};
