import { InferModel } from 'drizzle-orm';
import { pgTable, serial, varchar, uuid } from 'drizzle-orm/pg-core';

export const shippers = pgTable('shippers', {
  id: uuid('id').defaultRandom().primaryKey(),
  shipperId: serial('shipper_id').notNull(),
  companyName: varchar('company_name').notNull(),
  phone: varchar('phone').notNull(),
});

export type TShippers = InferModel<typeof shippers>;
export type NewTShippers = InferModel<typeof shippers, 'insert'>;
export type TableShippers = typeof shippers;
