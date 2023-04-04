import { CalculateExecutionTime } from 'helpers';

export type TDatabaseLogger = {
  sqlLog: CalculateExecutionTime[];
};

export type TCalcPage = {
  totalElementsFromDB: number;
  maxPage: number;
};

export type TSearchRepositoryResponse<N extends string, D> = TCalcPage &
  TDatabaseLogger & {
    tableName: N;
    searchColumnName: string;
    data: D[];
  };
