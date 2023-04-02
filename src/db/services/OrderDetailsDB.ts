import { orderDetails, products, TableOrderDetails, TOrderDetails } from 'db/schema';
import { TableDB } from './tableDB.service';
import { eq } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';
import { CalculateExecutionTime } from 'helpers';

export type TOrderDerailsById = {
  id: string;
  totalPrice: number;
  quantity: number;
  unitPrice: string;
  discount: string;
  productName: string | null;
  productId: number;
};

export type TOrderDerailsIdResponse = {
  sqlLog: CalculateExecutionTime;
  orderDetails: TOrderDerailsById[];
};

export class OrderDetailsDB extends TableDB<TOrderDetails, TableOrderDetails> {
  constructor() {
    super(orderDetails);
  }

  getById = async (searchId: number): Promise<TOrderDerailsIdResponse> => {
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

    return { orderDetails, sqlLog: new CalculateExecutionTime(startTime, sqlLogString) };
  };
}
