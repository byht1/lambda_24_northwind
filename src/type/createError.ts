export interface INewError extends Error {
  status?: number;
}

export type TCreateError = (status: number, message?: string) => INewError;
