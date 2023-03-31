import { Request, Response, NextFunction } from 'express';

export type Req<Q = any> = Request<any, any, any, Q>;
export type Res<T> = Response<T>;
export type Next = NextFunction;

export type TRouterFn<T, Q = any> = (req: Req<Q>, res: Res<T>, next?: Next) => Promise<Res<T>>;
