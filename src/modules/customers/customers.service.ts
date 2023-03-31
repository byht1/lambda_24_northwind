import { TCustomers } from 'db/schema';
import { CustomersDB } from 'db/services/CustomersDB.service';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

interface ICustomersService {
  getCustomers: (...args: [TQuery]) => Promise<TCustomers[]>;
}

export class CustomersService implements ICustomersService {
  constructor(private customersDB: CustomersDB = new CustomersDB()) {}

  async getCustomers(query: TQuery): Promise<TCustomers[]> {
    const params = formatQueryParams(query);

    return this.customersDB.getCustomers(params);
  }
}
