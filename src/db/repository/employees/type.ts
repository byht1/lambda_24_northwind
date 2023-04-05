import { TEmployees } from 'db/schema';
import {
  IRepositoryGetAll,
  IRepositoryGetOneById,
  TAllRepositoryResponse,
  TGetAllFn,
  TGetOneById,
  TOneRepositoryResponse,
} from '../type';

type TName = 'employee';
type TAnyName = 'employees';

export interface IEmployeesRepository
  extends IRepositoryGetAll<TAnyName, TEmployeesAllResponse>,
    IRepositoryGetOneById<TName, TEmployeesOneByIdResponse, number> {}

export type EmployeesAllFn = TGetAllFn<TAnyName, TEmployeesAllResponse>;
export type EmployeesOneByIdFn = TGetOneById<TName, TEmployeesOneByIdResponse, number>;

export type TEmployeesAllRes = TAllRepositoryResponse<TAnyName, TEmployeesAllResponse>;
export type TEmployeesOneByIdRes = TOneRepositoryResponse<TName, TEmployeesOneByIdResponse>;

type TEmployeesAllResponse = Pick<
  TEmployees,
  'id' | 'title' | 'city' | 'homePhone' | 'country' | 'employeeId'
> & { name: string };

type TReportsTo = {
  employeeId: number;
  name: string;
};

type TEmployeesOneByIdResponse = Omit<TEmployees, 'firstName' | 'lastName' | 'reportsTo'> & {
  reportsTo: TReportsTo | null;
  name: string;
};
