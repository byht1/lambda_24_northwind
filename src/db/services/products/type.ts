import { TSearchRepositoryResponse } from '../type';

export type TSearchProductsResponse = TSearchRepositoryResponse<'products', TSearchProducts>;

type TSearchProducts = {
  id: string;
  categoryI: number;
  quantityPerUnit: string;
  unitPrice: string;
  unitsInStock: number;
  productName: string;
};
