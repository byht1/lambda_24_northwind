import { eq } from 'drizzle-orm/expressions';

import { orderDetails, orders, TableOrders, TOrders } from 'db/schema';
import { TableDB, TCalcPage, TParams } from './tableDB.service';
import { sql } from 'drizzle-orm';

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

export type TGetOrdersDB = TCalcPage& {
  orders: TOrdersResponse[];
};

export class OrderDB extends TableDB<TOrders, TableOrders> {
  constructor() {
    super(orders);
  }

  getOrders = async (params: TParams): Promise<TGetOrdersDB> => {
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

    const [length, queryOrders] = await Promise.all([maxDBElements, queryOrdersPromise]);
    const { sql: sqlString } = queryOrdersPromise.toSQL();
    await this.logLastSqlQuery(sqlString);

    return { ...length, orders: queryOrders };
  };
}
