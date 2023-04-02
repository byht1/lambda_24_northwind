import { eq } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';

import { customers, orderDetails, orders, shippers, TableOrders, TOrders } from 'db/schema';
import { TableDB, TCalcPage, TParams } from './tableDB.service';
import { CalculateExecutionTime } from 'helpers';

type TOrdersResponse = {
  orderId: number;
  id: string;
  totalPrice: number;
  quantity: number;
  products: number;
  shippedDate: string | null;
  shipName: string;
  shipCountry: string;
  shipCity: string;
};

export type TGetOrdersDB = TCalcPage & {
  sqlLog: CalculateExecutionTime[];
  orders: TOrdersResponse[];
};

export type TOrderId = {
  id: string;
  orderId: number;
  orderDate: string;
  requiredDate: string;
  shippedDate: string | null;
  freight: string;
  shipAddress: string;
  shipCity: string;
  shipRegion: string | null;
  shipPostalCode: string | null;
  shipCountry: string;
  shipVia: string | null;
  shipPhone: string | null;
  shipName: string;
  customerId: string | null;
  totalPrice: number;
  quantity: number;
  products: number;
};

export type TOrderIdResponseDB = {
  order: TOrderId;
  sqlLog: CalculateExecutionTime;
};

export class OrderDB extends TableDB<TOrders, TableOrders> {
  constructor() {
    super(orders);
  }

  getOrders = async (params: TParams): Promise<TGetOrdersDB> => {
    const startTime = Date.now();
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
    const definitionQueryStatement = this.getQueryStringAndLog(queryOrdersPromise);

    const [totalElementsAndPages, queryOrders, sqlLogString] = await Promise.all([
      maxDBElements,
      queryOrdersPromise,
      definitionQueryStatement,
    ]);

    const { sqlLog: sqlLogTotalElementsAndPages, ...elementAndPage } = totalElementsAndPages;

    const sqlLog = [
      new CalculateExecutionTime(startTime, sqlLogString),
      sqlLogTotalElementsAndPages,
    ];

    return { sqlLog, ...elementAndPage, orders: queryOrders };
  };

  getOrderById = async (searchId: number): Promise<TOrderIdResponseDB> => {
    const startTime = Date.now();
    const { id, orderId, shipVia, _, employeeId, shipName, ...order } = this.table;
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
      sqlLog: new CalculateExecutionTime(startTime, sqlLogString),
    };
  };
}
