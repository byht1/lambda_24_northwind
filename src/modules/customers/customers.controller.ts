import { TParamsId, TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { CustomersService } from './customers.service';
import { TGetCustomerIdResponseDB, TGetCustomersDB } from 'db/services/CustomersDB.service';

interface ICustomersController {
  getCustomers: TRouterFn<TGetCustomersDB, TQuery>;
  getCustomerId: TRouterFn<TGetCustomerIdResponseDB, void, TParamsId>;
}

export class CustomersController implements ICustomersController {
  constructor(private customersService: CustomersService = new CustomersService()) {}

  getCustomers: TRouterFn<TGetCustomersDB, TQuery> = async (req, res) => {
    const query = req.query;
    const customers = await this.customersService.getCustomers(query);

    return res.json(customers);
  };

  getCustomerId: TRouterFn<TGetCustomerIdResponseDB, void, TParamsId> = async (req, res) => {
    const { searchId } = req.params;
    const customer = await this.customersService.getCustomerId(searchId);

    return res.json(customer);
  };

  search: TRouterFn<any, TQuery, { searchValue: string }> = async (req, res) => {
    const { searchValue } = req.params;

    const data = await this.customersService.customerSearch(req.query, searchValue);

    return res.json(data);
  };
}
