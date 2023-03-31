import { TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { TCustomers } from 'db/schema';
import { CustomersService } from './customers.service';

interface ICustomersController {
  getCustomers: TRouterFn<TCustomers[], TQuery>;
}

export class CustomersController implements ICustomersController {
  constructor(private customersService: CustomersService = new CustomersService()) {}

  getCustomers: TRouterFn<TCustomers[], TQuery> = async (req, res) => {
    const query = req.query;
    const customers = await this.customersService.getCustomers(query);

    return res.json(customers);
  };
}
