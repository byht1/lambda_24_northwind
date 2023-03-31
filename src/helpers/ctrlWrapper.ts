import { TCtrlWrapperFunc, TRouterFn } from 'type';

export const ctrlWrapper = <T>(ctrl: TRouterFn<T>) => {
  const func: TCtrlWrapperFunc = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return func;
};
