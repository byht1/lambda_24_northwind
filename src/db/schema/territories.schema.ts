import { InferModel } from 'drizzle-orm';
import { pgTable, serial, varchar, uuid } from 'drizzle-orm/pg-core';

export const territories = pgTable('territories', {
  id: uuid('id').defaultRandom().primaryKey(),
  territoryId: serial('territory_id').notNull(),
  regionId: serial('region_id').notNull(),
  territoryDescription: varchar('territory_description').notNull(),
});

export type TTerritories = InferModel<typeof territories>;
export type NewTTerritories = InferModel<typeof territories, 'insert'>;
export type TableTerritories = typeof territories;
