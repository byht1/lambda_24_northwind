import { CustomersDB, TGetCustomersDB } from 'db/services/CustomersDB.service';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

interface ICustomersService {
  getCustomers: (...args: [TQuery]) => Promise<TGetCustomersDB>;
}

export class CustomersService implements ICustomersService {
  constructor(private customersDB: CustomersDB = new CustomersDB()) {}

  async getCustomers(query: TQuery): Promise<TGetCustomersDB> {
    const params = formatQueryParams(query);

    return this.customersDB.getCustomers(params);
  }
}
