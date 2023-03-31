import { InferModel } from 'drizzle-orm';
import { integer, pgTable, serial, varchar, uuid, numeric } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: serial('product_id').notNull(),
  productName: varchar('product_name').notNull(),
  supplierId: serial('supplier_id').notNull(),
  categoryId: serial('category_id').notNull(),
  quantityPerUnit: varchar('quantity_per_unit').notNull(),
  unitPrice: numeric('unit_price').notNull(),
  unitsInStock: integer('units_in_stock').notNull(),
  unitsOnOrder: integer('units_on_order').notNull(),
  reorderLevel: integer('reorder_level').notNull(),
  discontinued: integer('discontinued').notNull(),
});

export type TProducts = InferModel<typeof products>;
export type NewTProducts = InferModel<typeof products, 'insert'>;
export type TableProducts = typeof products;
export const arrayColumnProducts = Object.keys(products);
