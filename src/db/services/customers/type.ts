import { TSearchRepositoryResponse } from '../type';

export type TSearchCustomersResponse = TSearchRepositoryResponse<'customers', TSearchCustomers>;

type TSearchCustomers = {
  companyName: string | null;
  contactName: string | null;
  contactTitle: string;
  phone: string | null;
  customerId: string;
  id: string;
};
