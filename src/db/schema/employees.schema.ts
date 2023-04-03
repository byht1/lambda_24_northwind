import { InferModel } from 'drizzle-orm';
import { integer, pgTable, varchar, uuid, alias } from 'drizzle-orm/pg-core';

export const employees = pgTable('employees', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: integer('employee_id').notNull(),
  lastName: varchar('last_name').notNull(),
  firstName: varchar('first_name').notNull(),
  title: varchar('title'),
  titleOfCourtesy: varchar('title_of_courtesy'),
  birthDate: varchar('birth_date'),
  hireDate: varchar('hire_date'),
  address: varchar('address'),
  city: varchar('city'),
  region: varchar('region'),
  postalCode: varchar('postal_code'),
  country: varchar('country'),
  homePhone: varchar('home_phone'),
  extension: integer('extension'),
  notes: varchar('notes'),
  reportsTo: integer('reports_to'),
});

export const employeesFiles = alias(employees, 'employees_files');

export type TEmployees = InferModel<typeof employees>;
export type NewTEmployees = InferModel<typeof employees, 'insert'>;
export type TableEmployees = typeof employees;
export const arrayColumnEmployees = Object.keys(employees);
