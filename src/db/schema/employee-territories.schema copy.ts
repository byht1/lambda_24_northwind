import { InferModel } from 'drizzle-orm';
import { integer, pgTable } from 'drizzle-orm/pg-core';

export const employeeTerritories = pgTable('employee_territories', {
  employeeId: integer('employee_id').notNull(),
  territoryId: integer('territory_id').notNull(),
});

export type TEmployeesTerritories = InferModel<typeof employeeTerritories>;
export type NewTEmployeesTerritories = InferModel<typeof employeeTerritories, 'insert'>;
export type TableEmployeesTerritories = typeof employeeTerritories;
