import { customers, TableCustomers, TCustomers } from 'db/schema';
import { TableDB, TCalcPage, TParams } from './tableDB.service';
import { sql } from 'drizzle-orm';

export type TCustomersDB = Pick<
  TCustomers,
  'id' | 'companyName' | 'contactName' | 'contactTitle' | 'city' | 'country'
>;

export type TGetCustomersDB = TCalcPage & {
  customers: TCustomersDB[];
};

export class CustomersDB extends TableDB<TCustomers, TableCustomers> {
  constructor() {
    super(customers);
  }

  getCustomers = async (params: TParams): Promise<TGetCustomersDB> => {
    const { id, companyName, contactName, contactTitle, city, country } = this.table;
    const { limit, offset } = params;
    const queryCustomersPromise = this.db
      .select({ id, companyName, contactName, contactTitle, city, country })
      .from(this.table)
      .limit(limit)
      .offset(offset);
    const maxDBElements = this.getMaxElementsCount(limit);
    const definitionQueryStatement = this.getQueryStringAndLog(queryCustomersPromise);

    const [totalElementsAndPages, queryCustomers] = await Promise.all([
      maxDBElements,
      queryCustomersPromise,
      definitionQueryStatement,
    ]);

    return { ...totalElementsAndPages, customers: queryCustomers };
  };
}
