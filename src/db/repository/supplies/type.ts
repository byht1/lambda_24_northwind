import { TSupplies } from 'db/schema';
import {
  IRepositoryGetAll,
  IRepositoryGetOneById,
  TAllRepositoryResponse,
  TGetAllFn,
  TGetOneById,
  TOneRepositoryResponse,
} from '../type';

type TName = 'supplier';
type TAnyName = 'supplies';

export interface ISuppliesRepository
  extends IRepositoryGetAll<TAnyName, TSuppliesAllResponse>,
    IRepositoryGetOneById<TName, TSuppliesOneByIdResponse, number> {}

export type SuppliesAllFn = TGetAllFn<TAnyName, TSuppliesAllResponse>;
export type SuppliesOneByIdFn = TGetOneById<TName, TSuppliesOneByIdResponse, number>;

export type TSuppliesAllRes = TAllRepositoryResponse<TAnyName, TSuppliesAllResponse>;
export type TSuppliesOneByIdRes = TOneRepositoryResponse<TName, TSuppliesOneByIdResponse>;

type TSuppliesAllResponse = Pick<
  TSupplies,
  'id' | 'companyName' | 'contactTitle' | 'city' | 'country' | 'contactName' | 'supplierId'
>;

type TSuppliesOneByIdResponse = TSupplies;
