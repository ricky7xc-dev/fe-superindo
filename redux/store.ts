import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './slices/authSlice';
import productCategoriesReducer from './slices/productCategoriesSlice';
import productReducer from './slices/productSlice';
import productVariantReducer from './slices/productVariantSlice';
import imageReducer from './slices/imageSlice';
import cartReducer from './slices/cartSlice';
import invoiceReducer from './slices/invoiceSlice';
import loggerMiddleware from './loggerMiddleware';

const store = configureStore({
  reducer: {
    auth: authReducer,
    productCategories: productCategoriesReducer,
    products: productReducer,
    productVariants: productVariantReducer,
    image: imageReducer,
    cart: cartReducer,
    invoice: invoiceReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;