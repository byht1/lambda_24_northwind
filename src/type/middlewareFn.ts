import { Request, Response, NextFunction } from 'express';

export type TMiddlewareFn = (req: Request, res: Response, next: NextFunction) => Promise<void>;
