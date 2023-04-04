import { CalculateExecutionTime } from 'helpers';
import { products, TableProducts, TProducts } from '../schema/products.schema';
import { TableDB, TCalcPage, TParams } from './tableDB.service';
import { eq, like } from 'drizzle-orm/expressions';
import { supplies } from 'db/schema';
import { TSearchProductsResponse } from './products/type';

export type TGetProducts = Pick<
  TProducts,
  'id' | 'productName' | 'quantityPerUnit' | 'unitPrice' | 'unitsInStock' | 'unitsOnOrder'
>;
type TGetProductId = Omit<TProducts, 'categoryId'>;

export type TGetProductsDB = TCalcPage & {
  sqlLog: CalculateExecutionTime[];
  products: TGetProducts[];
};

export type TGetProductByIdResponseDB = {
  product: TGetProductId;
  sqlLog: CalculateExecutionTime[];
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
      .offset(offset)
      .orderBy(productName);

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

  getProductById = async (searchId: number): Promise<TGetProductByIdResponseDB> => {
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

  find = async (
    params: TParams,
    searchValue: string,
    searchField?: string
  ): Promise<TSearchProductsResponse> => {
    const startTime = Date.now();
    const { quantityPerUnit, unitPrice, unitsInStock, productName, id, categoryId } = this.table;
    const searchColumnName = this.determineSearchField(searchField);
    const { limit, offset } = params;
    const sq = this.db
      .select()
      .from(this.table)
      .where(like(searchColumnName, `%${searchValue}%`))
      .as('sq');

    const searchDataCustomerPromise = this.db
      .select({ quantityPerUnit, unitPrice, unitsInStock, productName, id, categoryId })
      .from(this.table)
      .where(like(searchColumnName, `%${searchValue}%`))
      .limit(limit)
      .offset(offset);
    const maxDBElements = this.sqGetMaxElementsCount(sq, limit);
    const definitionQueryStatement = this.getQueryStringAndLog(searchDataCustomerPromise);

    const [totalElementsAndPages, searchDataCustomer, sqlLogString] = await Promise.all([
      maxDBElements,
      searchDataCustomerPromise,
      definitionQueryStatement,
    ]);

    const { sqlLog: sqlLogTotalElementsAndPages, ...elementAndPage } = totalElementsAndPages;
    const sqlLog = [
      new CalculateExecutionTime(startTime, sqlLogString),
      sqlLogTotalElementsAndPages,
    ];

    return {
      sqlLog,
      tableName: 'products',
      searchColumnName,
      ...elementAndPage,
      data: searchDataCustomer,
    };
  };

  private determineSearchField = (searchField?: string) => {
    const { productName, quantityPerUnit } = this.table;

    switch (searchField) {
      case 'quantityPerUnit':
        return quantityPerUnit;

      default:
        return productName;
    }
  };
}
