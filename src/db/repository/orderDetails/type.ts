import { TOrderDetails } from 'db/schema';
import {
  IRepositoryGetById,
  TByIdRepositoryResponse,
  TCalcProductsAndPrise,
  TGetById,
} from '../type';

type TAnyName = 'orderDetails';

export interface IOrderDetailsRepository
  extends IRepositoryGetById<TAnyName, TOrderDetailsByIdResponse, number> {}

export type OrdersDetailsByIdFn = TGetById<TAnyName, TOrderDetailsByIdResponse, number>;

export type TOrdersDetailsByIdRes = TByIdRepositoryResponse<TAnyName, TOrderDetailsByIdResponse>;

export type TOrderDetailsByIdResponse = Pick<
  TOrderDetails,
  'id' | 'unitPrice' | 'discount' | 'productId'
> &
  Omit<TCalcProductsAndPrise, 'products'>;
