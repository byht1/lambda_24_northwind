import { products, TableProducts, TProducts } from '../schema/products.schema';
import { TableDB, TParams } from './tableDB.service';

export class ProductDB extends TableDB<TProducts, TableProducts> {
  constructor() {
    super(products);
  }

  getProducts = async (params: TParams) => this.getAllData(params);
}
