import type { Request, Response, NextFunction } from 'express';
import type { ObjectSchema } from 'joi';
import { ApiError } from '../../common/errors/ApiError.js';

type ValidateTarget = 'body' | 'query' | 'params';

interface ValidateSchema {
    body?: ObjectSchema;
    query?: ObjectSchema;
    params?: ObjectSchema;
}

export const validate = (schema: ValidateSchema) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const targets: ValidateTarget[] = ['body', 'query', 'params'];

        for (const target of targets) {
            if (!schema[target]) continue;

            const { error, value } = schema[target]!.validate(req[target], {
                abortEarly: false,   // collect ALL errors, not just first
                stripUnknown: true,  // remove fields not in schema
                convert: true,       // coerce strings to numbers/booleans where typed
            });

            if (error) {
                const messages = error.details.map((d) => d.message.replace(/['"]/g, ''));
                return next(new ApiError(400, `Validation failed: ${messages.join(', ')}`));
            }

            // Safely assign validated values (handles read-only query/params getters)
            Object.defineProperty(req, target, {
                value,
                configurable: true,
                enumerable: true,
                writable: true
            });
        }

        next();
    };
};