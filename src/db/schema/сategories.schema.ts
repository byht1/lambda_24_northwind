import { InferModel } from 'drizzle-orm';
import { pgTable, serial, uuid, varchar } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: serial('category_id').notNull(),
  categoryName: varchar('category_name').notNull(),
  description: varchar('description').notNull(),
});

export type TCategories = InferModel<typeof categories>;
export type NewTCategories = InferModel<typeof categories, 'insert'>;
export type TableCategories = typeof categories;
