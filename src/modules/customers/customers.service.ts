import { CustomerRepository, TCustomersAllRes, TCustomersOneByIdRes } from 'db/repository';
import { createError, notFoundMessage } from 'helpers';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

interface ICustomersService {
  getCustomers: (...args: [TQuery]) => Promise<TCustomersAllRes>;
  getCustomerId: (...args: [string]) => Promise<TCustomersOneByIdRes>;
}

export class CustomersService implements ICustomersService {
  constructor(private customersDB: CustomerRepository = new CustomerRepository()) {}

  getCustomers = async (query: TQuery): Promise<TCustomersAllRes> => {
    const params = formatQueryParams(query);
    const customers = await this.customersDB.getAll(params);

    return customers;
  };

  getCustomerId = async (searchId: string): Promise<TCustomersOneByIdRes> => {
    const customerId = searchId.toUpperCase();
    const customer = await this.customersDB.getOneById(customerId);

    if (!customer.customer) {
      throw createError(404, notFoundMessage);
    }

    return customer;
  };
}
