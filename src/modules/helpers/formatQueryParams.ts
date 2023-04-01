import { TParams } from 'db/services/tableDB.service';
import { TQuery } from 'modules/type';

export const formatQueryParams = (params: TQuery): TParams => {
  const { limit = 20, page = 1 } = params;
  const limitElement = +limit;
  const currentPage = +page;
  const skip = (currentPage - 1) * limitElement;

  return {
    limit: limitElement,
    offset: skip,
  };
};
