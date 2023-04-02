import { TProducts } from 'db/schema/products.schema';
import { ProductDB, TGetProductsDB } from 'db/services/ProductDB.service';
import { createError } from 'helpers';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';
import { products } from '../../db/schema/products.schema';

interface IProductsService {
  getProducts: (...args: [TQuery]) => Promise<TGetProductsDB>;
}

export class ProductsService implements IProductsService {
  constructor(private productDB: ProductDB = new ProductDB()) {}

  async getProducts(query: TQuery): Promise<TGetProductsDB> {
    const params = formatQueryParams(query);

    return this.productDB.getProducts(params);
  }

  getProductById = async (searchId: number): Promise<any> => {
    const product = await this.productDB.getProductById(searchId);
    if (!product.product) {
      throw createError(404, 'No records found in the database matching your query.');
    }
    return product;
  };
}
