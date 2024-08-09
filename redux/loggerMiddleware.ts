import { Middleware } from '@reduxjs/toolkit';

const loggerMiddleware: Middleware = store => next => action => {
  console.log('Dispatching:', action);
  let result = next(action);
  console.log('Next State:', store.getState());
  return result;
};

export default loggerMiddleware;