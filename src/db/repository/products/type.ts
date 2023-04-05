import { TProducts } from 'db/schema';
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

type TName = 'product';
type TAnyName = 'products';

export interface IProductRepository
  extends IRepositoryGetAll<TAnyName, TProductsAllResponse>,
    IRepositoryGetOneById<TName, TProductOneByIdResponse, number>,
    IRepositoryFind<TAnyName, TSearchProducts> {}

export type ProductsAllFn = TGetAllFn<TAnyName, TProductsAllResponse>;
export type ProductsOneByIdFn = TGetOneById<TName, TProductOneByIdResponse, number>;
export type ProductsFindFn = TFindFn<TAnyName, TSearchProducts>;

export type TProductsAllRes = TAllRepositoryResponse<TAnyName, TProductsAllResponse>;
export type TProductsOneByIdRes = TOneRepositoryResponse<TName, TProductOneByIdResponse>;
export type TProductsFindRes = TSearchRepositoryResponse<TAnyName, TSearchProducts>;

// FIX
export type TSearchProductsResponse = TSearchRepositoryResponse<'products', TSearchProducts>;

type TProductsAllResponse = Pick<
  TProducts,
  'id' | 'productName' | 'quantityPerUnit' | 'unitPrice' | 'unitsInStock' | 'unitsOnOrder'
>;

type TProductOneByIdResponse = Omit<TProducts, 'categoryId'> & {
  supplier: string | null;
};

type TSearchProducts = Pick<
  TProducts,
  'id' | 'categoryId' | 'quantityPerUnit' | 'unitPrice' | 'unitsInStock' | 'productName'
>;
