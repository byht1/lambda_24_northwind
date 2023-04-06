import { TableProducts, products, supplies } from 'db/schema';
import { TableDB } from '../tableDB/tableDB.service';
import { IProductRepository, ProductsAllFn, ProductsFindFn, ProductsOneByIdFn } from './type';
import { CalculateExecutionTime } from 'helpers';
import { eq, ilike, like } from 'drizzle-orm/expressions';

export class ProductsRepository extends TableDB<TableProducts> implements IProductRepository {
  constructor() {
    super(products);
  }

  getAll: ProductsAllFn = async params => {
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
    const { sqlLog, products, ...elementAndPage } = await this.fetchDataWithLog(
      maxDBElements,
      queryProductsPromise,
      'products'
    );

    return { sqlLog, ...elementAndPage, products };
  };

  getOneById: ProductsOneByIdFn = async searchId => {
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

  find: ProductsFindFn = async (params, searchValue, searchField) => {
    const startTime = Date.now();
    const { quantityPerUnit, unitPrice, unitsInStock, productName, id, productId } = this.table;
    const searchColumnName = this.determineSearchField(searchField);
    const { limit, offset } = params;
    const sq = this.db
      .select()
      .from(this.table)
      .where(ilike(searchColumnName, `%${searchValue}%`))
      .as('sq');

    const searchDataCustomerPromise = this.db
      .select({ quantityPerUnit, unitPrice, unitsInStock, productName, id, productId })
      .from(this.table)
      .where(ilike(searchColumnName, `%${searchValue}%`))
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
      searchColumnName: searchField || 'productName',
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
