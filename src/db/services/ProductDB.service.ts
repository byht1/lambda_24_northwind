import { CalculateExecutionTime } from 'helpers';
import { products, TableProducts, TProducts } from '../schema/products.schema';
import { TableDB, TCalcPage, TParams } from './tableDB.service';
import { eq } from 'drizzle-orm/expressions';
import { supplies } from 'db/schema';

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

  getProductById = async (searchId: number): Promise<any> => {
    const startTime = Date.now();
    const { productId, supplierId, categoryId, _, ...column } = this.table;
    const queryProductPromise = this.db
      .select({
        ...column,
        productId,
        supplier: supplies.companyName,
        supplierId,
      })
      .from(this.table)
      .where(eq(productId, searchId))
      .leftJoin(supplies, eq(supplierId, supplies.supplierId));
    const definitionQueryStatement = this.getQueryStringAndLog(queryProductPromise);

    const [querySupplies, sqlLogString] = await Promise.all([
      queryProductPromise,
      definitionQueryStatement,
    ]);

    return {
      product: querySupplies[0],
      sqlLog: [new CalculateExecutionTime(startTime, sqlLogString)],
    };
  };
}
