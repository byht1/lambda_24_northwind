import { ProductsRepository, TProductsAllRes, TProductsOneByIdRes } from 'db/repository';
import { createError, notFoundMessage } from 'helpers';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

interface IProductsService {
  getProducts: (...args: [TQuery]) => Promise<TProductsAllRes>;
  getProductById: (...args: [number]) => Promise<TProductsOneByIdRes>;
}

export class ProductsService implements IProductsService {
  constructor(private productDB: ProductsRepository = new ProductsRepository()) {}

  async getProducts(query: TQuery): Promise<TProductsAllRes> {
    const params = formatQueryParams(query);

    return this.productDB.getAll(params);
  }

  getProductById = async (searchId: number): Promise<TProductsOneByIdRes> => {
    const product = await this.productDB.getOneById(searchId);
    if (!product.product) {
      throw createError(404, notFoundMessage);
    }
    return product;
  };
}
