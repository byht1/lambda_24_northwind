import e from 'cors';
import { TOrders, TSupplies } from 'db/schema';
import { OrderDB, TGetOrdersDB } from 'db/services/OrderDB.service';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';
import { roundedNumber } from '../../helpers/roundedNumber';

interface IOrdersService {
  getOrders: (...args: [TQuery]) => Promise<TGetOrdersDB>;
}

export class OrdersService implements IOrdersService {
  constructor(private orderDB: OrderDB = new OrderDB()) {}

  async getOrders(query: TQuery): Promise<TGetOrdersDB> {
    const params = formatQueryParams(query);
    const orders = await this.orderDB.getOrders(params);
    return orders;
  }
}
