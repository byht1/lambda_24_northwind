import { TDatabaseLogger } from './any';

export type TOneRepositoryResponse<F extends string, D> = TDatabaseLogger & {
  [key in F]: D;
};

export type TGetOneById<F extends string, D, I extends number | string = number> = (
  ...args: [I]
) => Promise<TOneRepositoryResponse<F, D>>;

export interface IRepositoryGetOneById<F extends string, D, I extends number | string = number> {
  getOneById: TGetOneById<F, D, I>;
}
