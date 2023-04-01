import { products, TableProducts, TProducts } from '../schema/products.schema';
import { TableDB, TCalcPage, TParams } from './tableDB.service';

export type TGetProducts = Pick<
  TProducts,
  'id' | 'productName' | 'quantityPerUnit' | 'unitPrice' | 'unitsInStock' | 'unitsOnOrder'
>;

export type TGetProductsDB = TCalcPage & {
  products: TGetProducts[];
};

export class ProductDB extends TableDB<TProducts, TableProducts> {
  constructor() {
    super(products);
  }

  getProducts = async (params: TParams): Promise<TGetProductsDB> => {
    const { id, productName, quantityPerUnit, unitPrice, unitsInStock, unitsOnOrder } = this.table;
    const { limit, offset } = params;
    const queryProductsPromise = this.db
      .select({ id, productName, quantityPerUnit, unitPrice, unitsInStock, unitsOnOrder })
      .from(this.table)
      .limit(limit)
      .offset(offset);
    const maxDBElements = this.getMaxElementsCount(limit);

    const [length, queryPromise] = await Promise.all([maxDBElements, queryProductsPromise]);
    const { sql: sqlString } = queryProductsPromise.toSQL();
    await this.logLastSqlQuery(sqlString);

    return { ...length, products: queryPromise };
  };
}
