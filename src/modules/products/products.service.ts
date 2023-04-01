import { TProducts } from 'db/schema/products.schema';
import { ProductDB, TGetProductsDB } from 'db/services/ProductDB.service';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

interface IProductsService {
  getProducts: (...args: [TQuery]) => Promise<TGetProductsDB>;
}

export class ProductsService implements IProductsService {
  constructor(private productDB: ProductDB = new ProductDB()) {}

  async getProducts(query: TQuery): Promise<TGetProductsDB> {
    const params = formatQueryParams(query);

    return this.productDB.getProducts(params);
  }
}
