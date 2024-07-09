import { configureStore } from '@reduxjs/toolkit';
import parkingReducer from './reducers/parkingSlice';
import userReducer from './reducers/userSlice';
import cartReducer from "./reducers/cartSlice"
import bookingReducer from './reducers/bookingSlice';
export const store = configureStore({
  reducer: {
    parkings: parkingReducer,
    user :userReducer,
    cart:cartReducer,
    booking:bookingReducer
    // Add other reducers here if needed
  },
});