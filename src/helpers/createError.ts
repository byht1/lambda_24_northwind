import { TCreateError, INewError } from 'type';

const messages: { [index: number]: string } = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict',
};

export const createError: TCreateError = (status, message = messages[status]) => {
  const error: INewError = new Error(message);
  error.status = status;

  return error;
};
