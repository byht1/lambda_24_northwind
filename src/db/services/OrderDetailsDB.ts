import { orderDetails, products, TableOrderDetails, TOrderDetails } from 'db/schema';
import { TableDB } from './tableDB.service';
import { eq } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';

export class OrderDetailsDB extends TableDB<TOrderDetails, TableOrderDetails> {
  constructor() {
    super(orderDetails);
  }

  getById = async (searchId: number) => {
    const { productId, quantity, unitPrice, id, orderId, discount } = this.table;

    const OrderDetailsPromise = this.db
      .select({
        id,
        totalPrice: sql<number>`ROUND(SUM(${unitPrice} * ${quantity}),2)`.mapWith(it => +it),
        quantity: sql<number>`SUM(${quantity})`.mapWith(it => +it),
        unitPrice,
        discount,
        productName: products.productName,
        productId,
      })
      .from(this.table)
      .leftJoin(products, eq(productId, products.productId))
      .where(eq(orderId, searchId))
      .groupBy(id, products.productName);

    return OrderDetailsPromise;
  };
}
