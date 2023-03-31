import { products, TableProducts, TProducts } from '../schema/products.schema';
import { TableDB, TParams } from './tableDB.service';

export type TGetProducts = Pick<
  TProducts,
  'id' | 'productName' | 'quantityPerUnit' | 'unitPrice' | 'unitsInStock' | 'unitsOnOrder'
>;

export class ProductDB extends TableDB<TProducts, TableProducts> {
  constructor() {
    super(products);
  }

  getProducts = async (params: TParams): Promise<TGetProducts[]> => {
    const { id, productName, quantityPerUnit, unitPrice, unitsInStock, unitsOnOrder } = this.table;
    const { limit, offset } = params;
    const query = this.db
      .select({ id, productName, quantityPerUnit, unitPrice, unitsInStock, unitsOnOrder })
      .from(this.table)
      .limit(limit)
      .offset(offset);

    const { sql } = query.toSQL();
    await this.logLastSqlQuery(sql);

    return query;
  };
}
