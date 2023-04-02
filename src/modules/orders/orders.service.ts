import { OrderDB, TGetOrdersDB, TOrderId } from 'db/services/OrderDB.service';
import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';
import { OrderDetailsDB, TOrderDerailsById } from 'db/services/OrderDetailsDB';
import { CalculateExecutionTime, createError } from 'helpers';

export type TOrderById = {
  sqlLog: CalculateExecutionTime[];
  order: TOrderId;
  products: TOrderDerailsById[];
};

interface IOrdersService {
  getOrders: (...args: [TQuery]) => Promise<TGetOrdersDB>;
  getOrderId: (...args: [number]) => Promise<TOrderById>;
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

  async getOrderId(searchId: number): Promise<TOrderById> {
    const orderPromise = this.orderDB.getOrderById(searchId);
    const orderDetailsPromise = this.orderDetailsDB.getById(searchId);
    const [order, orderDetails] = await Promise.all([orderPromise, orderDetailsPromise]);
    const { order: orderResponse, sqlLog: orderSql } = order;
    const { orderDetails: orderDetailsResponse, sqlLog: orderDetailsSql } = orderDetails;
    if (!orderResponse) {
      throw createError(404, 'No records found in the database matching your query.');
    }

    const sqlLog = [orderSql, orderDetailsSql];

    return { sqlLog, order: orderResponse, products: orderDetailsResponse };
  }
}
