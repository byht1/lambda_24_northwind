import { TParamsId, TQuery } from 'modules/type';
import { TRouterFn } from 'type';
import { CustomersService } from './customers.service';
import { TCustomersAllRes, TCustomersOneByIdRes } from 'db/repository';

interface ICustomersController {
  getCustomers: TRouterFn<TCustomersAllRes, TQuery>;
  getCustomerId: TRouterFn<TCustomersOneByIdRes, void, TParamsId>;
}

export class CustomersController implements ICustomersController {
  constructor(private customersService: CustomersService = new CustomersService()) {}

  getCustomers: TRouterFn<TCustomersAllRes, TQuery> = async (req, res) => {
    const query = req.query;
    const customers = await this.customersService.getCustomers(query);

    return res.json(customers);
  };

  getCustomerId: TRouterFn<TCustomersOneByIdRes, void, TParamsId> = async (req, res) => {
    const { searchId } = req.params;
    const customer = await this.customersService.getCustomerId(searchId);

    return res.json(customer);
  };
}
