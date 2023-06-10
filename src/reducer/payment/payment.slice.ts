/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAppAsyncThunk, updateBalance } from '../user/user.slice';
import apiService from '@/app/server';
import { IResponse, IBookingRes } from '@/utils/interface';
import { EStatusIBooking, EStatusRedux } from '@/utils/enum';
import { createToast } from '@/utils/utils';

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
  count: number;
  countAll: number;
  countBookingSuccess: number;
  page: number;
}

const initialState: IPaymentRedux = {
  status: EStatusRedux.idle,
  isInitial: false,
  statusPayment: null,
  bookings: [],
  errorMessage: '',
  errorMessageChargeOrWithdraw: '',
  count: 0,
  countAll: 0,
  countBookingSuccess: 0,
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
    builder.addCase(fetchCountBookingAtHotel.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchCountBookingAll.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchCharge.fulfilled, (state) => {
      state.status = EStatusRedux.succeeded;
      createToast('Charge successfully', 'success');
    });
    builder.addCase(fetchWithdraw.fulfilled, (state) => {
      state.status = EStatusRedux.succeeded;
      createToast('Withdraw successfully', 'success');
    });
    builder.addCase(fetchGetBookingsByHotelier.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload.data) {
        if (action.payload.page === 1) {
          state.bookings = action.payload.data.bookings;
        } else {
          state.bookings = [...state.bookings, ...action.payload.data.bookings];
        }
        if (action.payload.data.bookings[0].status === EStatusIBooking.SUCCESS) {
          state.countBookingSuccess = action.payload.data.count;
        }
        state.count = action.payload.data.count;
        state.page = action.payload.page;
        state.statusPayment = action.payload.data.bookings[0].status as EStatusIBooking;
      }
    });
    builder.addCase(fetchCountBookingAtHotel.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload) {
        if (action.payload.count > state.countBookingSuccess) {
          createToast('You have new booking', 'success');
        }

        if (action.payload.count < state.countBookingSuccess) {
          createToast('You have new decline booking', 'info');
        }
        state.countBookingSuccess = action.payload.count;
      }
    });
    builder.addCase(fetchCountBookingAll.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload) {
        state.countAll = action.payload.count;
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
        state.count = 0;
      }
      state.statusPayment = action.meta.arg.status;
      state.errorMessage = action.error.message || 'some thing wrong';
    });

    builder.addCase(fetchCountBookingAtHotel.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchCountBookingAll.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
  },
});

interface IResBookings {
  bookings: IBookingRes[];
  count: number;
}

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
    const response = await apiService.get<IResponse<IResBookings>>(
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

interface ICountBookings {
  count: number;
}

export const fetchCountBookingAtHotel = createAppAsyncThunk(
  'payment/fetchCountBookingAtHotel',
  async (hotelId: string) => {
    const response = await apiService.get<IResponse<ICountBookings>>(
      '/payment/hotelier/count',
      {
        params: { allHotel: false, hotelId },
      }
    );
    return response.data.data;
  }
);

export const fetchCountBookingAll = createAppAsyncThunk(
  'payment/fetchCountBookingAll',
  async (hotelId: string) => {
    const response = await apiService.get<IResponse<ICountBookings>>(
      '/payment/hotelier/count',
      {
        params: { allHotel: true, hotelId },
      }
    );

    return response.data.data;
  }
);

export const { setStatusPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
