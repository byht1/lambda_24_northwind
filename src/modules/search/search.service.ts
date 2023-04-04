import { CustomersDB } from 'db/services/CustomersDB.service';
import { ProductDB } from 'db/services/ProductDB.service';
import { TQuerySearch } from './search.controller';
import { formatQueryParams } from 'modules/helpers';
import { createError } from 'helpers';
import { TParams } from 'db/services/tableDB.service';
import { TSearchCustomersResponse } from 'db/services/customers/type';
import { TSearchProductsResponse } from 'db/services/products/type';

interface ISearchService {
  getFind: (...args: [TQuerySearch]) => Promise<TFindResponse>;
}

type TParamsSearch = [TParams, string, string];
type TTableName = 'customersDB' | 'productDB';
export type TFindResponse = TSearchCustomersResponse | TSearchProductsResponse;

export class SearchService implements ISearchService {
  constructor(
    private productDB: ProductDB = new ProductDB(),
    private customersDB: CustomersDB = new CustomersDB()
  ) {}

  getFind = async (query: TQuerySearch): Promise<TFindResponse> => {
    const { table, searchValue, field, limit, page } = query;
    const paramsSearch: TParamsSearch = [formatQueryParams({ limit, page }), searchValue, field];

    switch (table) {
      case 'customers':
        const customers = await this.getFindSearchDB('customersDB', paramsSearch);
        return customers;

      case 'products':
        const products = await this.getFindSearchDB('productDB', paramsSearch);
        return products;

      default:
        createError(
          400,
          'Invalid table name, table does not exist, table not available for search.'
        );
    }

    return await this.getFindSearchDB('productDB', paramsSearch);
  };

  private getFindSearchDB = async (
    tableName: TTableName,
    params: TParamsSearch
  ): Promise<TFindResponse> => {
    return await this[tableName].find(...params);
  };
}
