import { TCustomers } from 'db/schema';
import {
  IRepositoryFind,
  IRepositoryGetAll,
  IRepositoryGetOneById,
  TAllRepositoryResponse,
  TFindFn,
  TGetAllFn,
  TGetOneById,
  TOneRepositoryResponse,
  TSearchRepositoryResponse,
} from '../type';

type TName = 'customer';
type TAnyName = 'customers';

export interface ICustomerRepository
  extends IRepositoryGetAll<TAnyName, TCustomersAllResponse>,
    IRepositoryGetOneById<TName, TCustomers, string>,
    IRepositoryFind<TAnyName, TSearchCustomers> {}

export type CustomersAllFn = TGetAllFn<TAnyName, TCustomersAllResponse>;
export type CustomersOneByIdFn = TGetOneById<TName, TCustomers, string>;
export type CustomersFindFn = TFindFn<TAnyName, TSearchCustomers>;

export type TCustomersAllRes = TAllRepositoryResponse<TAnyName, TCustomersAllResponse>;
export type TCustomersOneByIdRes = TOneRepositoryResponse<TName, TCustomers>;
export type TCustomersFindRes = TSearchRepositoryResponse<TAnyName, TSearchCustomers>;

type TCustomersAllResponse = Pick<
  TCustomers,
  'id' | 'companyName' | 'contactName' | 'contactTitle' | 'city' | 'country' | 'customerId'
>;

type TSearchCustomers = Pick<
  TCustomers,
  'id' | 'companyName' | 'contactName' | 'contactTitle' | 'phone' | 'customerId'
>;
