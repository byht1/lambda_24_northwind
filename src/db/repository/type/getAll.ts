import { TCalcPage, TDatabaseLogger, TParams } from './any';

export type TAllRepositoryResponse<F extends string, D> = TDatabaseLogger &
  TCalcPage & {
    [key in F]: D[];
  };

export type TGetAllFn<N extends string, D> = (
  ...args: [TParams]
) => Promise<TAllRepositoryResponse<N, D>>;

export interface IRepositoryGetAll<N extends string, D> {
  getAll: TGetAllFn<N, D>;
}
