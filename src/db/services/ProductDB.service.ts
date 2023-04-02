import { CalculateExecutionTime } from 'helpers';
import { products, TableProducts, TProducts } from '../schema/products.schema';
import { TableDB, TCalcPage, TParams } from './tableDB.service';
import { sql } from 'drizzle-orm';

export type TGetProducts = Pick<
  TProducts,
  'id' | 'productName' | 'quantityPerUnit' | 'unitPrice' | 'unitsInStock' | 'unitsOnOrder'
>;

export type TGetProductsDB = TCalcPage & {
  sqlLog: CalculateExecutionTime[];
  products: TGetProducts[];
};

export class ProductDB extends TableDB<TProducts, TableProducts> {
  constructor() {
    super(products);
  }

  getProducts = async (params: TParams): Promise<TGetProductsDB> => {
    const startTime = Date.now();
    const { id, productName, quantityPerUnit, unitPrice, unitsInStock, unitsOnOrder, productId } =
      this.table;
    const { limit, offset } = params;
    const queryProductsPromise = this.db
      .select({
        id,
        productName,
        quantityPerUnit,
        unitPrice,
        unitsInStock,
        unitsOnOrder,
        productId,
      })
      .from(this.table)
      .limit(limit)
      .offset(offset);

    const maxDBElements = this.getMaxElementsCount(limit);
    const definitionQueryStatement = this.getQueryStringAndLog(queryProductsPromise);

    const [totalElementsAndPages, queryPromise, sqlLogString] = await Promise.all([
      maxDBElements,
      queryProductsPromise,
      definitionQueryStatement,
    ]);

    const { sqlLog: sqlLogTotalElementsAndPages, ...elementAndPage } = totalElementsAndPages;
    const sqlLog = [
      new CalculateExecutionTime(startTime, sqlLogString),
      sqlLogTotalElementsAndPages,
    ];

    return { sqlLog, ...elementAndPage, products: queryPromise };
  };
}
