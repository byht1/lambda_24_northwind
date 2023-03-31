import { InferModel } from 'drizzle-orm';
import { pgTable, serial, varchar, uuid } from 'drizzle-orm/pg-core';

export const regions = pgTable('regions', {
  id: uuid('id').defaultRandom().primaryKey(),
  regionId: serial('region_id').notNull(),
  regionDescription: varchar('region_description').notNull(),
});

export type TRegions = InferModel<typeof regions>;
export type NewTRegions = InferModel<typeof regions, 'insert'>;
export type TableRegions = typeof regions;
