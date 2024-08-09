import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './slices/authSlice';
import productCategoriesReducer from './slices/productCategoriesSlice';
import productReducer from './slices/productSlice';
import productVariantReducer from './slices/productVariantSlice';
import imageReducer from './slices/imageSlice';
import loggerMiddleware from './loggerMiddleware';

const store = configureStore({
  reducer: {
    auth: authReducer,
    productCategories: productCategoriesReducer,
    products: productReducer,
    productVariants: productVariantReducer,
    image: imageReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;