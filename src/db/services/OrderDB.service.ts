import { eq } from 'drizzle-orm/expressions';

import { orderDetails, orders, TableOrders, TOrders } from 'db/schema';
import { TableDB, TParams } from './tableDB.service';

export type TGetOrdersDB = {
  id: string;
  orderId: number;
  unitPrice: string | null;
  quantity: number | null;
  productId: number | null;
  shippedDate: string | null;
  shipName: string;
  shipCountry: string;
  shipCity: string;
};

export class OrderDB extends TableDB<TOrders, TableOrders> {
  constructor() {
    super(orders);
  }

  getOrders = async (params: TParams): Promise<TGetOrdersDB[]> => {
    const { id, orderId, shippedDate, shipName, shipCity, shipCountry } = this.table;
    const { unitPrice, quantity, productId } = orderDetails;
    const { limit, offset } = params;
    const query = this.db
      .select({
        id,
        orderId,
        unitPrice,
        quantity,
        productId,
        shippedDate,
        shipName,
        shipCountry,
        shipCity,
      })
      .from(this.table)
      .leftJoin(orderDetails, eq(this.table.orderId, orderDetails.orderId))
      .limit(limit)
      .offset(offset);

    const { sql } = query.toSQL();
    await this.logLastSqlQuery(sql);

    return query;
  };
}
