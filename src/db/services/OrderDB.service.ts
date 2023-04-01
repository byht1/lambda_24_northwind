import { eq } from 'drizzle-orm/expressions';

import { orderDetails, orders, TableOrders, TOrders } from 'db/schema';
import { TableDB, TParams } from './tableDB.service';
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

export type TGetOrdersDB = {
  length: number;
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

    const maxLength = this.db
      .select({ count: sql<string>`count(*)`.mapWith(it => +it) })
      .from(this.table);

    const [length, queryOrders] = await Promise.all([maxLength, queryOrdersPromise]);
    const { sql: sqlString } = queryOrdersPromise.toSQL();
    await this.logLastSqlQuery(sqlString);

    return { length: length[0].count, orders: queryOrders };
  };
}
