import { InferModel } from 'drizzle-orm';
import { integer, pgTable, serial, varchar, uuid, numeric } from 'drizzle-orm/pg-core';
import { orderDetails } from './order-details.schema';

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: serial('order_id')
    .notNull()
    .references(() => orderDetails.orderId),
  employeeId: serial('employee_id').notNull(),
  orderDate: varchar('order_date').notNull(),
  requiredDate: varchar('required_date').notNull(),
  shippedDate: varchar('shipped_date'),
  shipVia: integer('ship_via').notNull(),
  freight: numeric('freight').notNull(),
  shipName: varchar('ship_name').notNull(),
  shipAddress: varchar('ship_address').notNull(),
  shipCity: varchar('ship_city').notNull(),
  shipRegion: varchar('ship_region'),
  shipPostalCode: varchar('ship_postal_code'),
  shipCountry: varchar('ship_country').notNull(),
});

export type TOrders = InferModel<typeof orders>;
export type NewTOrders = InferModel<typeof orders, 'insert'>;
export type TableOrders = typeof orders;
export const arrayColumnOrders = Object.keys(orders);
