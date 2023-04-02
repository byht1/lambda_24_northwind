import { TCreateError, INewError } from 'type';
import { messages } from './errorMessage';

export const createError: TCreateError = (status, message = messages[status]) => {
  const error: INewError = new Error(message);
  error.status = status;

  return error;
};
