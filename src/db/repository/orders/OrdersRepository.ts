import { TableDB } from '../tableDB/tableDB.service';
import { TableOrders, customers, orderDetails, orders, shippers } from 'db/schema';
import { IOrdersRepository, OrdersAllFn, OrdersOneByIdFn } from './type';
import { sql } from 'drizzle-orm';
import { CalculateExecutionTime } from 'helpers';
import { eq } from 'drizzle-orm/expressions';

export class OrdersRepository extends TableDB<TableOrders> implements IOrdersRepository {
  constructor() {
    super(orders);
  }

  getAll: OrdersAllFn = async params => {
    const { id, orderId, shippedDate, shipName, shipCity, shipCountry } = this.table;
    const { limit, offset } = params;
    const queryOrdersPromise = this.db
      .select({
        id,
        orderId,
        totalPrice:
          sql<number>`ROUND(SUM(${orderDetails.unitPrice} * ${orderDetails.quantity}),2)`.mapWith(
            it => +it
          ),
        quantity: sql<number>`SUM(${orderDetails.quantity})`.mapWith(it => +it),
        products: sql<number>`COUNT(${orderDetails.productId})`.mapWith(it => +it),
        shippedDate,
        shipName,
        shipCountry,
        shipCity,
      })
      .from(this.table)
      .leftJoin(orderDetails, eq(orderId, orderDetails.orderId))
      .groupBy(orderDetails.orderId, orderId, id)
      .orderBy(orderId)
      .limit(limit)
      .offset(offset);

    const maxDBElements = this.getMaxElementsCount(limit);
    const { sqlLog, orders, ...elementAndPage } = await this.fetchDataWithLog(
      maxDBElements,
      queryOrdersPromise,
      'orders'
    );

    return { sqlLog, ...elementAndPage, orders };
  };

  getOneById: OrdersOneByIdFn = async searchId => {
    const startTime = Date.now();
    const { id, orderId, shipVia, employeeId, shipName, _, ...order } = this.table;
    const queryOrderPromise = this.db
      .select({
        id,
        orderId,
        ...order,
        shipVia: shippers.companyName,
        shipPhone: shippers.phone,
        shipName,
        customerId: customers.customerId,
        totalPrice:
          sql<number>`ROUND(SUM(${orderDetails.unitPrice} * ${orderDetails.quantity}),2)`.mapWith(
            it => +it
          ),
        quantity: sql<number>`SUM(${orderDetails.quantity})`.mapWith(it => +it),
        products: sql<number>`COUNT(${orderDetails.productId})`.mapWith(it => +it),
      })
      .from(this.table)
      .where(eq(orderId, searchId))
      .leftJoin(orderDetails, eq(orderId, orderDetails.orderId))
      .leftJoin(shippers, eq(shipVia, shippers.shipperId))
      .leftJoin(customers, eq(shipName, customers.companyName))
      .groupBy(
        orderDetails.orderId,
        orderId,
        id,
        shippers.companyName,
        shippers.phone,
        customers.customerId
      );

    const definitionQueryStatement = this.getQueryStringAndLog(queryOrderPromise);

    const [queryOrder, sqlLogString] = await Promise.all([
      queryOrderPromise,
      definitionQueryStatement,
    ]);

    return {
      order: queryOrder[0],
      sqlLog: [new CalculateExecutionTime(startTime, sqlLogString)],
    };
  };
}
