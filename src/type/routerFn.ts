import { Request, Response, NextFunction } from 'express';

export type Req<Q = any, P = any> = Request<P, any, any, Q>;
export type Res<T> = Response<T>;
export type Next = NextFunction;

export type TRouterFn<T, Q = any, P = any> = (
  req: Req<Q, P>,
  res: Res<T>,
  next?: Next
) => Promise<Res<T>>;
