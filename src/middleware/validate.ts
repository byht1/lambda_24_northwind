import { TMiddlewareFn } from 'type';
import { ZodType, ZodError } from 'zod';

type TField = 'query' | 'params' | 'header';

export const validate = (schema: ZodType, field: TField = 'query'): TMiddlewareFn => {
  return async (req, res, next) => {
    try {
      schema.parse(req[field]);
      next();
    } catch (error) {
      const e = (error as ZodError).errors;
      const customError = e.reduce<Record<string, string>>((acc, { message, path }) => {
        acc[path[0]] = message;
        return acc;
      }, {});

      res.status(400).json(customError);
    }
  };
};
