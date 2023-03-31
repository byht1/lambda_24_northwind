import { TOrders, TSupplies } from 'db/schema';
import { OrderDB } from 'db/services/OrderDB.service';
import { SuppliesDB } from 'db/services/Supplies.service';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';

interface IOrdersService {
  getOrders: (...args: [TQuery]) => Promise<TOrders[]>;
}

export class OrdersService implements IOrdersService {
  constructor(private orderDB: OrderDB = new OrderDB()) {}

  async getOrders(query: TQuery): Promise<TOrders[]> {
    const params = formatQueryParams(query);

    return this.orderDB.getOrders(params);
  }
}
