import Joi from 'joi';

export const registerSchema = {
    body: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        username: Joi.string().min(3).max(30).lowercase().trim().required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(8).max(72)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .message('Password must contain uppercase, lowercase, and a number')
            .required(),
        role: Joi.string().valid('author').default('author'),
    }),
};

export const loginSchema = {
    body: Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().required(),
    }),
};