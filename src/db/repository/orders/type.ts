import { TOrders } from 'db/schema';
import {
  IRepositoryGetAll,
  IRepositoryGetOneById,
  TAllRepositoryResponse,
  TCalcProductsAndPrise,
  TGetAllFn,
  TGetOneById,
  TOneRepositoryResponse,
} from '../type';

type TName = 'order';
type TAnyName = 'orders';

export interface IOrdersRepository
  extends IRepositoryGetAll<TAnyName, TOrdersAllResponse>,
    IRepositoryGetOneById<TName, TOrdersOneByIdResponse, number> {}

export type OrdersAllFn = TGetAllFn<TAnyName, TOrdersAllResponse>;
export type OrdersOneByIdFn = TGetOneById<TName, TOrdersOneByIdResponse, number>;

export type TOrdersAllRes = TAllRepositoryResponse<TAnyName, TOrdersAllResponse>;
export type TOrdersOneByIdRes = TOneRepositoryResponse<TName, TOrdersOneByIdResponse>;

type TOrdersAllResponse = Pick<
  TOrders,
  'id' | 'orderId' | 'shippedDate' | 'shipName' | 'shipCountry' | 'shipCity'
> &
  TCalcProductsAndPrise;

export type TOrdersOneByIdResponse = Omit<TOrders, 'shipVia' | 'employeeId'> & {
  shipVia: string | null;
  shipPhone: string | null;
  customerId: string | null;
} & TCalcProductsAndPrise;

// type TOrdersOneByIdResponse = {
//   id: string;
//   orderId: number;
//   orderDate: string;
//   requiredDate: string;
//   shippedDate: string | null;
//   freight: string;
//   shipAddress: string;
//   shipCity: string;
//   shipRegion: string | null;
//   shipPostalCode: string | null;
//   shipCountry: string;
//   shipVia: string | null;
//   shipPhone: string | null;
//   shipName: string;
//   customerId: string | null;
//   totalPrice: number;
//   quantity: number;
//   products: number;
// };
