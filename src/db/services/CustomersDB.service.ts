import { customers, TableCustomers, TCustomers } from 'db/schema';
import { TableDB, TCalcPage, TParams } from './tableDB.service';
import { sql } from 'drizzle-orm';
import { CalculateExecutionTime } from 'helpers';

export type TCustomersDB = Pick<
  TCustomers,
  'id' | 'companyName' | 'contactName' | 'contactTitle' | 'city' | 'country'
>;

export type TGetCustomersDB = TCalcPage & {
  sqlLog: CalculateExecutionTime[];
  customers: TCustomersDB[];
};

export class CustomersDB extends TableDB<TCustomers, TableCustomers> {
  constructor() {
    super(customers);
  }

  getCustomers = async (params: TParams): Promise<TGetCustomersDB> => {
    const startTime = Date.now();
    const { id, companyName, contactName, contactTitle, city, country } = this.table;
    const { limit, offset } = params;
    const queryCustomersPromise = this.db
      .select({ id, companyName, contactName, contactTitle, city, country })
      .from(this.table)
      .limit(limit)
      .offset(offset);
    const maxDBElements = this.getMaxElementsCount(limit);
    const definitionQueryStatement = this.getQueryStringAndLog(queryCustomersPromise);

    const [totalElementsAndPages, queryCustomers, sqlLogString] = await Promise.all([
      maxDBElements,
      queryCustomersPromise,
      definitionQueryStatement,
    ]);

    const { sqlLog: sqlLogTotalElementsAndPages, ...elementAndPage } = totalElementsAndPages;
    const sqlLog = [
      new CalculateExecutionTime(startTime, sqlLogString),
      sqlLogTotalElementsAndPages,
    ];

    return { sqlLog, ...elementAndPage, customers: queryCustomers };
  };
}
