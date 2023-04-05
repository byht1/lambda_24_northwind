import { CalculateExecutionTime } from 'helpers';

export type TParams = {
  offset: number;
  limit: number;
};

export type TDatabaseLogger = {
  sqlLog: CalculateExecutionTime[];
};

export type TCalcPage = {
  totalElementsFromDB: number;
  maxPage: number;
};

export type TCalcProductsAndPrise = { totalPrice: number; quantity: number; products: number };
