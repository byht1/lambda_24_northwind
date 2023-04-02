import {
  CustomersDB,
  TGetCustomerIdResponseDB,
  TGetCustomersDB,
} from 'db/services/CustomersDB.service';
import { createError, notFoundMessage } from 'helpers';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

interface ICustomersService {
  getCustomers: (...args: [TQuery]) => Promise<TGetCustomersDB>;
  getCustomerId: (...args: [string]) => Promise<TGetCustomerIdResponseDB>;
}

export class CustomersService implements ICustomersService {
  constructor(private customersDB: CustomersDB = new CustomersDB()) {}

  getCustomers = async (query: TQuery): Promise<TGetCustomersDB> => {
    const params = formatQueryParams(query);
    const customers = await this.customersDB.getCustomers(params);

    return customers;
  };

  getCustomerId = async (searchId: string): Promise<TGetCustomerIdResponseDB> => {
    const customerId = searchId.toUpperCase();
    const customer = await this.customersDB.getCustomerId(customerId);

    if (!customer.customer) {
      throw createError(404, notFoundMessage);
    }

    return customer;
  };
}
