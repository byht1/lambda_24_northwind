import { eq, like } from 'drizzle-orm/expressions';
import { CalculateExecutionTime } from 'helpers';

import { TableCustomers, customers } from 'db/schema';
import { TableDB } from '../tableDB/tableDB.service';
import { CustomersAllFn, CustomersOneByIdFn, CustomersFindFn, ICustomerRepository } from './type';

export class CustomerRepository extends TableDB<TableCustomers> implements ICustomerRepository {
  constructor() {
    super(customers);
  }

  getAll: CustomersAllFn = async params => {
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

    // const test = await this.allAwait(
    //   maxDBElements,
    //   queryCustomersPromise,
    //   definitionQueryStatement,
    //   'customers'
    // );

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

  getOneById: CustomersOneByIdFn = async searchId => {
    const startTime = Date.now();
    const { customerId } = this.table;
    const customerPromise = this.db.select().from(this.table).where(eq(customerId, searchId));
    const definitionQueryStatement = this.getQueryStringAndLog(customerPromise);
    const [customer, sqlLogString] = await Promise.all([customerPromise, definitionQueryStatement]);

    return {
      customer: customer[0],
      sqlLog: [new CalculateExecutionTime(startTime, sqlLogString)],
    };
  };

  find: CustomersFindFn = async (params, searchValue, searchField) => {
    const startTime = Date.now();
    const { companyName, contactName, contactTitle, phone, id, customerId } = this.table;
    const searchColumnName = this.determineSearchField(searchField);
    const { limit, offset } = params;
    const sq = this.db
      .select()
      .from(this.table)
      .where(like(searchColumnName, `%${searchValue}%`))
      .as('sq');

    const searchDataCustomerPromise = this.db
      .select({ companyName, contactName, contactTitle, phone, id, customerId })
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
      tableName: 'customers',
      searchColumnName: searchField || 'companyName',
      ...elementAndPage,
      data: searchDataCustomer,
    };
  };

  private determineSearchField = (searchField?: string) => {
    const { companyName, contactName, contactTitle, phone } = this.table;

    switch (searchField) {
      case 'contactName':
        return contactName;

      case 'contactTitle':
        return contactTitle;

      case 'phone':
        return phone;

      default:
        return companyName;
    }
  };
}
