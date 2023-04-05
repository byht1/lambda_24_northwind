import { TableOrderDetails, orderDetails, products } from 'db/schema';
import { TableDB } from '../tableDB/tableDB.service';
import { IOrderDetailsRepository, OrdersDetailsByIdFn } from './type';
import { sql } from 'drizzle-orm';
import { CalculateExecutionTime } from 'helpers';
import { eq } from 'drizzle-orm/expressions';

export class OrderDetailsRepository
  extends TableDB<TableOrderDetails>
  implements IOrderDetailsRepository
{
  constructor() {
    super(orderDetails);
  }

  getById: OrdersDetailsByIdFn = async searchId => {
    const startTime = Date.now();
    const { productId, quantity, unitPrice, id, orderId, discount } = this.table;

    const orderDetailsPromise = this.db
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

    const definitionQueryStatement = this.getQueryStringAndLog(orderDetailsPromise);

    const [orderDetails, sqlLogString] = await Promise.all([
      orderDetailsPromise,
      definitionQueryStatement,
    ]);

    return { orderDetails, sqlLog: [new CalculateExecutionTime(startTime, sqlLogString)] };
  };
}
