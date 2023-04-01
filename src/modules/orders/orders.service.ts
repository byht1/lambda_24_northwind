import e from 'cors';
import { TOrders, TSupplies } from 'db/schema';
import { OrderDB, TGetOrdersDB } from 'db/services/OrderDB.service';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';
import { roundedNumber } from '../../helpers/roundedNumber';
import { OrderDetailsDB } from 'db/services/OrderDetailsDB';
import { DrizzleTypeError } from 'drizzle-orm/utils';
import { createError } from 'helpers';

interface IOrdersService {
  getOrders: (...args: [TQuery]) => Promise<TGetOrdersDB>;
  getOrderId: (...args: [number]) => Promise<any>;
}

export class OrdersService implements IOrdersService {
  constructor(
    private orderDB: OrderDB = new OrderDB(),
    private orderDetailsDB: OrderDetailsDB = new OrderDetailsDB()
  ) {}

  async getOrders(query: TQuery): Promise<TGetOrdersDB> {
    const params = formatQueryParams(query);
    const orders = await this.orderDB.getOrders(params);

    return orders;
  }

  async getOrderId(searchId: number): Promise<any> {
    const orderPromise = this.orderDB.getOrderById(searchId);
    const orderDetailsPromise = this.orderDetailsDB.getById(searchId);
    const [order, orderDetails] = await Promise.all([orderPromise, orderDetailsPromise]);

    return { order, products: orderDetails };
  }
}
