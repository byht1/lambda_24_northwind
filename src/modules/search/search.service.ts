import {
  CustomerRepository,
  ProductsRepository,
  TCustomersFindRes,
  TProductsFindRes,
} from 'db/repository';
import { createError } from 'helpers';
import { formatQueryParams } from 'modules/helpers';
import { TQuerySearch } from './search.controller';
import { TParams } from 'db/repository/type';

type TParamsSearch = [TParams, string, string];
type TTableName = 'customersDB' | 'productDB';
export type TFindResponse = TCustomersFindRes | TProductsFindRes;

interface ISearchService {
  getFind: (...args: [TQuerySearch]) => Promise<TFindResponse>;
}

export class SearchService implements ISearchService {
  constructor(
    private productDB: ProductsRepository = new ProductsRepository(),
    private customersDB: CustomerRepository = new CustomerRepository()
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
