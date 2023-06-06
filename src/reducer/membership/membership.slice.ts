/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk, fetchUser } from '../user/user.slice';
import apiService from '@/app/server';
import { IResponse, IMembership } from '@/utils/interface';
import { EPackage, EStatusRedux } from '@/utils/enum';
import { fetchGetHotels } from '../hotel/hotel.slice';

export interface IMembershipRedux {
  status: EStatusRedux;
  isExpire: boolean;
  memberships: IMembership[];
  errorMessage: string;
  page: number;
  errorPaymentMemberShip: string;
}

const initialState: IMembershipRedux = {
  status: EStatusRedux.idle,
  isExpire: false,
  memberships: [],
  errorMessage: '',
  page: 1,
  errorPaymentMemberShip: '',
};

export const membershipSlice = createSlice({
  name: 'membership',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPaymentMembership.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorPaymentMemberShip = '';
    });

    builder.addCase(fetchGetMembership.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchPaymentMembership.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;

      if (action.payload) state.memberships.unshift(action.payload);
    });
    builder.addCase(fetchGetMembership.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      const { data, isExpire, page } = action.payload;
      if (data) {
        if ((page === 1 && isExpire !== state.isExpire) || !state.memberships.length) {
          state.memberships = data;
        }

        if (page !== 1) state.memberships = [...state.memberships, ...data];

        state.page = page;
        state.isExpire = isExpire;
      }
    });

    builder.addCase(fetchPaymentMembership.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorPaymentMemberShip = action.payload || 'some thing wrong';
    });
    builder.addCase(fetchGetMembership.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      if (state.isExpire !== action.meta.arg.isExpire) {
        state.isExpire = action.meta.arg.isExpire;
        state.page = action.meta.arg.page;
        state.memberships = [];
      }
      state.errorMessage = action.error.message || 'some thing wrong';
    });
  },
});

export const fetchPaymentMembership = createAppAsyncThunk(
  'membership/fetchPaymentMembership',
  async (
    { packageHotel, password }: { password: string; packageHotel: EPackage },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await apiService.put<IResponse<IMembership>>(
        '/payment/payment-membership',
        {
          package: packageHotel,
          password,
        }
      );

      dispatch(fetchUser());
      dispatch(fetchGetHotels());

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message as string);
    }
  }
);

export const fetchGetMembership = createAppAsyncThunk(
  'membership/fetchGetMembership',
  async ({
    packageHotel,
    page = 1,
    isExpire,
  }: {
    packageHotel?: string;
    page: number;
    isExpire: boolean;
  }) => {
    const response = await apiService.get<IResponse<IMembership[]>>(
      '/payment/membership',
      {
        params: { package: packageHotel, page, isExpire },
      }
    );

    return { data: response.data.data, page, isExpire };
  }
);

export default membershipSlice.reducer;
