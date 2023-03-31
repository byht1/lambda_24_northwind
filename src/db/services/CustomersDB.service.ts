import { customers, TableCustomers, TCustomers } from 'db/schema';
import { TableDB, TParams } from './tableDB.service';

export type TGetCustomersDB = Pick<
  TCustomers,
  'id' | 'companyName' | 'contactName' | 'contactTitle' | 'city' | 'country'
>;

export class CustomersDB extends TableDB<TCustomers, TableCustomers> {
  constructor() {
    super(customers);
  }

  getCustomers = async (params: TParams) => {
    const { id, companyName, contactName, contactTitle, city, country } = this.table;
    const { limit, offset } = params;
    const query = this.db
      .select({ id, companyName, contactName, contactTitle, city, country })
      .from(this.table)
      .limit(limit)
      .offset(offset);

    const { sql } = query.toSQL();
    await this.logLastSqlQuery(sql);

    return query;
  };
}
