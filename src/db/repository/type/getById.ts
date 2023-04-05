import { TDatabaseLogger } from './any';

export type TByIdRepositoryResponse<F extends string, D> = TDatabaseLogger & {
  [key in F]: D[];
};

export type TGetById<F extends string, D, I extends number | string = number> = (
  ...args: [I]
) => Promise<TByIdRepositoryResponse<F, D>>;

export interface IRepositoryGetById<F extends string, D, I extends number | string = number> {
  getById: TGetById<F, D, I>;
}
