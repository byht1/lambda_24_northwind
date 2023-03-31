import { InferModel } from 'drizzle-orm';
import { integer, numeric, pgTable, serial, uuid } from 'drizzle-orm/pg-core';

export const orderDetails = pgTable('order_details', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: serial('order_id').notNull(),
  productId: serial('product_id').notNull(),
  unitPrice: numeric('unit_price').notNull(),
  quantity: integer('quantity').notNull(),
  discount: numeric('discount').notNull(),
});

export type TOrderDetails = InferModel<typeof orderDetails>;
export type NewTOrderDetails = InferModel<typeof orderDetails, 'insert'>;
export type TableOrderDetails = typeof orderDetails;
