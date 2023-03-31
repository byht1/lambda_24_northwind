import { Request, Response, NextFunction } from 'express';

export type TCtrlWrapperFunc = (req: Request, res: Response, next: NextFunction) => void;
