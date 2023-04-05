import { TCalcPage, TDatabaseLogger, TParams } from './any';

export type TSearchRepositoryResponse<N extends string, D> = TCalcPage &
  TDatabaseLogger & {
    tableName: N;
    searchColumnName: string;
    data: D[];
  };

export type TFindFn<N extends string, D> = (
  ...args: [TParams, string, string?]
) => Promise<TSearchRepositoryResponse<N, D>>;

export interface IRepositoryFind<N extends string, D> {
  find: TFindFn<N, D>;
}
