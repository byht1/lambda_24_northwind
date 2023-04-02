import {
  ProductDB,
  TGetProductByIdResponseDB,
  TGetProductsDB,
} from 'db/services/ProductDB.service';
import { createError, notFoundMessage } from 'helpers';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

interface IProductsService {
  getProducts: (...args: [TQuery]) => Promise<TGetProductsDB>;
  getProductById: (...args: [number]) => Promise<TGetProductByIdResponseDB>;
}

export class ProductsService implements IProductsService {
  constructor(private productDB: ProductDB = new ProductDB()) {}

  async getProducts(query: TQuery): Promise<TGetProductsDB> {
    const params = formatQueryParams(query);

    return this.productDB.getProducts(params);
  }

  getProductById = async (searchId: number): Promise<TGetProductByIdResponseDB> => {
    const product = await this.productDB.getProductById(searchId);
    if (!product.product) {
      throw createError(404, notFoundMessage);
    }
    return product;
  };
}
