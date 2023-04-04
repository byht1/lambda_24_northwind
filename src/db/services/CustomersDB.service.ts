import { customers, TableCustomers, TCustomers } from 'db/schema';
import { TableDB, TCalcPage, TParams } from './tableDB.service';
import { sql } from 'drizzle-orm';
import { CalculateExecutionTime, getRegion } from 'helpers';
import { eq, like } from 'drizzle-orm/expressions';

export type TCustomersDB = Pick<
  TCustomers,
  'id' | 'companyName' | 'contactName' | 'contactTitle' | 'city' | 'country' | 'customerId'
>;

export type TGetCustomersDB = TCalcPage & {
  sqlLog: CalculateExecutionTime[];
  customers: TCustomersDB[];
};

export type TGetCustomerIdResponseDB = {
  customer: TCustomers;
  sqlLog: CalculateExecutionTime[];
};

export class CustomersDB extends TableDB<TCustomers, TableCustomers> {
  constructor() {
    super(customers);
  }

  getCustomers = async (params: TParams): Promise<TGetCustomersDB> => {
    const startTime = Date.now();
    const { id, companyName, contactName, contactTitle, city, country, customerId } = this.table;
    const { limit, offset } = params;
    const queryCustomersPromise = this.db
      .select({
        id,
        customerId,
        companyName,
        contactName,
        contactTitle,
        city,
        country,
      })
      .from(this.table)
      .limit(limit)
      .offset(offset)
      .orderBy(companyName);

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

  getCustomerId = async (searchId: string): Promise<TGetCustomerIdResponseDB> => {
    const startTime = Date.now();
    const { customerId } = this.table;
    const customerPromise = this.db.select().from(this.table).where(eq(customerId, searchId));
    const definitionQueryStatement = this.getQueryStringAndLog(customerPromise);
    const [customer, sqlLogString] = await Promise.all([customerPromise, definitionQueryStatement]);

    return { customer: customer[0], sqlLog: [new CalculateExecutionTime(startTime, sqlLogString)] };
  };

  find = async (params: TParams, searchValue: string, searchField?: string) => {
    const startTime = Date.now();
    const { companyName } = this.table;
    const { limit, offset } = params;
    const searchDataCustomerPromise = this.db
      .select()
      .from(this.table)
      .where(like(companyName, `%${searchValue}%`))
      .limit(limit)
      .offset(offset);

    // const searchDataCustomerPromiseSQ = await this.db
    //   .select()
    //   .from(this.table)
    //   .where(like(companyName, `%${searchValue}%`))
    //   .limit(limit)
    //   .offset(offset)
    //   .as('sq');

    // const page = await this.db
    //   .select({ count: sql<string>`count(*)`.mapWith(it => +it) })
    //   .from(searchDataCustomerPromiseSQ);

    const maxDBElements = this.getMaxElementsCount(limit);
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

    return { sqlLog, ...elementAndPage, data: searchDataCustomer };
  };
}
