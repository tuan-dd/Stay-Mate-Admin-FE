/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAppAsyncThunk, updateBalance } from '../user/user.slice';
import apiService from '@/app/server';
import { IResponse, IBookingRes } from '@/utils/interface';
import { EStatusIBooking, EStatusRedux } from '@/utils/enum';

export interface IBookingResCustom extends IBookingRes {
  errorMessage?: string;
}

export interface IPaymentRedux {
  isInitial: boolean;
  status: EStatusRedux;
  statusPayment: EStatusIBooking | null;
  bookings: IBookingResCustom[];
  errorMessage: string;
  errorMessageChargeOrWithdraw: string;
  page: number;
}

const initialState: IPaymentRedux = {
  status: EStatusRedux.idle,
  isInitial: false,
  statusPayment: null,
  bookings: [],
  errorMessage: '',
  errorMessageChargeOrWithdraw: '',
  page: 1,
};

interface ISetStatusPayment {
  id: string;
  status: EStatusIBooking;
}

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setStatusPayment: (state, action: PayloadAction<ISetStatusPayment>) => {
      state.bookings.forEach((booking) => {
        if (booking._id === action.payload.id) {
          booking.status = action.payload.status;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCharge.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessageChargeOrWithdraw = '';
    });
    builder.addCase(fetchWithdraw.pending, (state) => {
      state.status = EStatusRedux.pending;

      state.errorMessageChargeOrWithdraw = '';
    });
    builder.addCase(fetchGetBookingsByHotelier.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchCharge.fulfilled, (state) => {
      state.status = EStatusRedux.succeeded;
    });
    builder.addCase(fetchWithdraw.fulfilled, (state) => {
      state.status = EStatusRedux.succeeded;
    });
    builder.addCase(fetchGetBookingsByHotelier.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload.data) {
        if (action.payload.page === 1) {
          state.bookings = action.payload.data;
        } else {
          state.bookings = [...state.bookings, ...action.payload.data];
        }

        state.page = action.payload.page;
        state.statusPayment = action.payload.data[0].status as EStatusIBooking;
      }
    });

    builder.addCase(fetchCharge.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessageChargeOrWithdraw = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchWithdraw.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessageChargeOrWithdraw = action.payload || 'some thing wrong';
    });

    builder.addCase(fetchGetBookingsByHotelier.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      if (state.statusPayment !== action.meta.arg.status) {
        state.bookings = [];
      }
      state.statusPayment = action.meta.arg.status;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
  },
});

export const fetchGetBookingsByHotelier = createAppAsyncThunk(
  'payment/fetchGetBookingByHotelier',
  async ({
    allHotel,
    hotelId,
    page,
    status,
  }: {
    allHotel: boolean;
    hotelId: string;
    page: number;
    status: EStatusIBooking;
  }) => {
    const response = await apiService.get<IResponse<IBookingRes[]>>(
      '/payment/hotelier/booking',
      {
        params: { allHotel, hotelId, page, status },
      }
    );

    return { data: response.data.data, page };
  }
);

export const fetchCharge = createAppAsyncThunk(
  'payment/fetchCharge',
  async (balance: number, { dispatch }) => {
    try {
      await apiService.put<IResponse>('/payment/charge', {
        balance,
      });
      dispatch(updateBalance(balance));
      return 'oke';
    } catch (error) {
      return error;
    }
  }
);

export const fetchWithdraw = createAppAsyncThunk(
  'payment/fetchWithdraw',
  async (
    { withdraw, password }: { password: string; withdraw: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await apiService.put<IResponse>('/payment/withdraw', {
        withdraw,
        password,
      });
      dispatch(updateBalance(-withdraw));
      return 'oke';
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const { setStatusPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
