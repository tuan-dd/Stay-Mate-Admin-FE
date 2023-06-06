import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from '@reducer/auth/auth.slice';
import userReducer from '@reducer/user/user.slice';
import paymentReducer from '@reducer/payment/payment.slice';
import reviewReducer from '@reducer/review/review.slice';
import hotelReducer from '@reducer/hotel/hotel.slice';
import membershipReducer from '@reducer/membership/membership.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    payment: paymentReducer,
    review: reviewReducer,
    hotel: hotelReducer,
    membership: membershipReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
