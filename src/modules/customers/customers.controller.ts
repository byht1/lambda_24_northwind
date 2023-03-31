import { TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { CustomersService } from './customers.service';
import { TGetCustomersDB } from 'db/services/CustomersDB.service';

interface ICustomersController {
  getCustomers: TRouterFn<TGetCustomersDB[], TQuery>;
}

export class CustomersController implements ICustomersController {
  constructor(private customersService: CustomersService = new CustomersService()) {}

  getCustomers: TRouterFn<TGetCustomersDB[], TQuery> = async (req, res) => {
    const query = req.query;
    const customers = await this.customersService.getCustomers(query);

    return res.json(customers);
  };
}
