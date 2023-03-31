import { InferModel } from 'drizzle-orm';
import { pgTable, varchar, uuid } from 'drizzle-orm/pg-core';

export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: varchar('customer_id').notNull(),
  companyName: varchar('company_name'),
  contactName: varchar('contact_name'),
  contactTitle: varchar('contact_title').notNull(),
  address: varchar('address'),
  city: varchar('city'),
  region: varchar('region'),
  postalCode: varchar('postal_code'),
  country: varchar('country').notNull(),
  phone: varchar('phone'),
  fax: varchar('fax'),
});

export type TCustomers = InferModel<typeof customers>;
export type NewTCustomers = InferModel<typeof customers, 'insert'>;
export type TableCustomers = typeof customers;
export const arrayColumnCustomers = Object.keys(customers);
