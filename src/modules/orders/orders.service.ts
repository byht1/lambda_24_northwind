import { formatQueryParams } from 'modules/helpers';
import { TQuery } from 'modules/type';
import { CalculateExecutionTime, createError, notFoundMessage } from 'helpers';
import {
  OrderDetailsRepository,
  OrdersRepository,
  TOrderDetailsByIdResponse,
  TOrdersAllRes,
  TOrdersOneByIdResponse,
} from 'db/repository';

export type TOrderById = {
  sqlLog: CalculateExecutionTime[];
  order: TOrdersOneByIdResponse;
  products: TOrderDetailsByIdResponse[];
};

interface IOrdersService {
  getOrders: (...args: [TQuery]) => Promise<TOrdersAllRes>;
  getOrderId: (...args: [number]) => Promise<TOrderById>;
}

export class OrdersService implements IOrdersService {
  constructor(
    private orderDB: OrdersRepository = new OrdersRepository(),
    private orderDetailsDB: OrderDetailsRepository = new OrderDetailsRepository()
  ) {}

  async getOrders(query: TQuery): Promise<TOrdersAllRes> {
    const params = formatQueryParams(query);
    const orders = await this.orderDB.getAll(params);

    return orders;
  }

  async getOrderId(searchId: number): Promise<TOrderById> {
    const orderPromise = this.orderDB.getOneById(searchId);
    const orderDetailsPromise = this.orderDetailsDB.getById(searchId);
    const [order, orderDetails] = await Promise.all([orderPromise, orderDetailsPromise]);

    const { order: orderResponse, sqlLog: orderSql } = order;
    const { orderDetails: orderDetailsResponse, sqlLog: orderDetailsSql } = orderDetails;

    if (!orderResponse) {
      throw createError(404, notFoundMessage);
    }

    const sqlLog = [...orderSql, ...orderDetailsSql];

    return { sqlLog, order: orderResponse, products: orderDetailsResponse };
  }
}
