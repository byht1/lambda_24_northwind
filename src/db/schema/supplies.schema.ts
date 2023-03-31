import { InferModel } from 'drizzle-orm';
import { pgTable, serial, varchar, uuid } from 'drizzle-orm/pg-core';

export const supplies = pgTable('supplies', {
  id: uuid('id').defaultRandom().primaryKey(),
  supplierId: serial('supplier_id').notNull(),
  companyName: varchar('company_name').notNull(),
  contactName: varchar('contact_name').notNull(),
  contactTitle: varchar('contact_title').notNull(),
  address: varchar('address').notNull(),
  city: varchar('city').notNull(),
  region: varchar('region'),
  postalCode: varchar('postal_code').notNull(),
  country: varchar('country').notNull(),
  phone: varchar('phone').notNull(),
  fax: varchar('fax'),
  homePage: varchar('home_page'),
});

export type TSupplies = InferModel<typeof supplies>;
export type NewTSupplies = InferModel<typeof supplies, 'insert'>;
export type TableSupplies = typeof supplies;
export const arrayColumnSupplies = Object.keys(supplies);
