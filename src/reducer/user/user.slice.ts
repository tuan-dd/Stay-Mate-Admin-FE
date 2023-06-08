/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';
import { getDeleteFilter, TProsLodash, createToast } from '@utils/utils';
import { ERole, EStatusRedux } from '@utils/enum';
import apiService from '@/app/server';
import { IHotel, IResponse, IRoom, IUser } from '@/utils/interface';
import { setHeaders } from '@/utils/jwt';
import { AppDispatch, RootState } from '@/app/store';
import { setAuth, setIsInitialState } from '../auth/auth.slice';
/**
 * @getUser
 * @getHotel
 * @UpdateUser
 * @updateHotel
 */

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}>();

interface IUserRedux {
  status: EStatusRedux;
  currentUser: IUser | null;
  myHotels: IHotel<IRoom[]>[] | null;
  role: ERole | string;
  errorMessage: string;
}

const initialState: IUserRedux = {
  status: EStatusRedux.idle,
  currentUser: null,
  myHotels: null,
  role: '',
  errorMessage: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.status = EStatusRedux.succeeded;

      const deleteToken: TProsLodash<IUser> = getDeleteFilter(
        ['accessToken', 'refreshToken'],
        action.payload
      );
      state.currentUser = deleteToken;
      state.role = deleteToken.role;
      state.errorMessage = '';
    },
    logOut: (state) => {
      state = cloneDeep(initialState);
      return state;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.status = EStatusRedux.succeeded;
      state.errorMessage = '';
      (state.currentUser as IUser).account.balance += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchCreateUser.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchUpdateUser.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload) {
        state.role = action.payload?.role;
        state.currentUser = action.payload;
      }
    });
    builder.addCase(fetchCreateUser.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload.data) {
        state.currentUser = action.payload.data;
      }
      createToast('You are already our member', 'success');
    });
    builder.addCase(fetchUpdateUser.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      const { name, avatar } = action.payload;
      if (state.currentUser) state.currentUser = { ...state.currentUser, name, avatar };
      createToast('Update successfully', 'success');
    });

    builder.addCase(fetchUser.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchCreateUser.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchUpdateUser.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
  },
});

export const fetchUser = createAppAsyncThunk(
  'user/fetchUser',
  async (_, { dispatch, rejectWithValue }) => {
    setHeaders();
    try {
      const response = await apiService.get<IResponse<IUser>>('/user/me');

      if (response.data.data?.email) dispatch(setAuth(response.data.data?.email));

      return response.data.data;
    } catch (error: any) {
      dispatch(setIsInitialState());
      return rejectWithValue(error.message as string);
    }
  }
);

export const fetchCreateUser = createAppAsyncThunk(
  'user/fetchCreateUser',
  async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await apiService.post<IResponse<IUser>>('/user/sign-up', {
      name,
      email,
      password,
    });
    return response.data;
  }
);

export interface IUpdateUser {
  name: string;
  avatar?: string;
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const fetchUpdateUser = createAppAsyncThunk(
  'user/fetchUpdateUser',
  async (updateUser: IUpdateUser) => {
    await apiService.put<IResponse<IUser>>('/user/user-update', {
      ...updateUser,
    });
    return {
      name: updateUser.name,
      avatar: updateUser.avatar as string,
    };
  }
);

export const { setUser, updateBalance, logOut } = userSlice.actions;

export default userSlice.reducer;
