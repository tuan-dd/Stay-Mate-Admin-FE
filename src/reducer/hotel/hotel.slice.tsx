/* eslint-disable @typescript-eslint/no-use-before-define */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import apiService from '@/app/server';
import { createAppAsyncThunk, fetchUser } from '../user/user.slice';
import { IHotel, IResponse, IRoom, IUser } from '@/utils/interface';
import { setAllCookie, setHeaders } from '@/utils/jwt';
import { EStatusRedux } from '@/utils/enum';
import { ICreateHotel, ICreateRoom } from '@/components/modal/ModalCreateOrUpdateHotel';
import { createToast, getDeleteFilter } from '@/utils/utils';

interface IHotelier {
  status: EStatusRedux;
  myHotels: IHotel<IRoom[]>[];
  targetHotel: IHotel<IRoom[]> | null;
  targetRoom: IRoom | null;
  errorMessage: string;
}

const initialState: IHotelier = {
  status: EStatusRedux.idle,
  myHotels: [],
  targetHotel: null,
  targetRoom: null,
  errorMessage: '',
};

export const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    setTarget: (state, action: PayloadAction<number>) => {
      if (state.myHotels.length > 0) {
        state.targetHotel = state.myHotels[action.payload];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGetHotels.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchCreateHotel.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchCreateRoom.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchUpdateHotel.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchUpdateRoom.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchUpdateDeleteHotel.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchGetHotels.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload) {
        state.myHotels = action.payload;
      }
    });
    builder.addCase(fetchCreateHotel.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload) {
        action.payload.isDelete = false;
        state.myHotels.push(action.payload);
        createToast('Create hotel success', 'success');
      }
    });
    builder.addCase(fetchCreateRoom.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      const { hotelId, rooms, isCreateMulti } = action.payload;
      if (rooms) {
        if (isCreateMulti) {
          state.myHotels?.forEach((hotel) => {
            hotel.roomTypeIds = hotel.roomTypeIds.concat(rooms);
          });
        } else {
          state.myHotels?.forEach((hotel) => {
            if (hotelId === hotel._id) {
              hotel.roomTypeIds = hotel.roomTypeIds.concat(rooms);
            }
          });
          if (state.targetHotel) {
            state.targetHotel.roomTypeIds = state.targetHotel?.roomTypeIds.concat(rooms);
          }
        }

        createToast('Create room success', 'success');
      }
    });
    builder.addCase(fetchUpdateHotel.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      const { index, newUpdateHotel } = action.payload;
      if (newUpdateHotel) {
        const {
          hotelName,
          images,
          address,
          city,
          country,
          propertyType,
          zipCode,
          latitude,
          longitude,
          star,
        } = newUpdateHotel;
        if (state.myHotels && state.targetHotel) {
          state.myHotels[index] = {
            ...state.myHotels[index],
            hotelName,
            images,
            address,
            city,
            country,
            propertyType,
            zipCode,
            latitude,
            longitude,
            star,
          };
          state.targetHotel = {
            ...state.targetHotel,
            hotelName,
            images,
            address,
            city,
            country,
            propertyType,
            zipCode,
            latitude,
            longitude,
            star,
          };
          createToast('Update hotel success', 'success');
        }
      }
    });
    builder.addCase(fetchUpdateRoom.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      const { data, id } = action.payload;

      state.targetHotel?.roomTypeIds.forEach((room, i) => {
        if (room._id === id && state.targetHotel) {
          state.targetHotel.roomTypeIds[i] = { ...room, ...data };
        }
      });

      if (state.myHotels)
        state.myHotels.forEach((hotel, index) =>
          hotel.roomTypeIds.forEach((room, i) => {
            if (room._id === id) {
              state.myHotels[index].roomTypeIds[i] = {
                ...hotel.roomTypeIds[i],
                ...data,
              };
            }
          })
        );
      createToast('Update hotel success', 'success');
    });
    builder.addCase(fetchUpdateDeleteHotel.fulfilled, (state, action) => {
      state.status = EStatusRedux.error;
      const { index, isDelete } = action.payload;
      if (state.myHotels && state.targetHotel) {
        state.myHotels[index].isDelete = isDelete;
        state.targetHotel.isDelete = isDelete;
        createToast('Update hotel success', 'success');
      }
    });
    builder.addCase(fetchUpdateDeleteRoom.fulfilled, (state, action) => {
      state.status = EStatusRedux.error;
      const { idHotel, idDelete } = action.payload;
      if (state.myHotels && state.targetHotel) {
        const indexHotel = state.myHotels.findIndex((hotel) => hotel._id === idHotel);
        if (indexHotel > -1) {
          state.myHotels[indexHotel].roomTypeIds = state.myHotels[
            indexHotel
          ].roomTypeIds.filter((room) => room._id !== idDelete);
        }
        state.targetHotel.roomTypeIds = state.targetHotel.roomTypeIds.filter(
          (room) => room._id !== idDelete
        );

        createToast('Delete is room success', 'success');
      }
    });

    builder.addCase(fetchGetHotels.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
      createToast(action.error.message || 'Some thing wrong', 'error');
    });
    builder.addCase(fetchCreateHotel.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
      createToast(action.error.message || 'Some thing wrong', 'error');
    });
    builder.addCase(fetchCreateRoom.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
      createToast(action.error.message || 'Some thing wrong', 'error');
    });
    builder.addCase(fetchUpdateHotel.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
      createToast(action.error.message || 'Some thing wrong', 'error');
    });
    builder.addCase(fetchUpdateRoom.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
      createToast(action.error.message || 'Some thing wrong', 'error');
    });
    builder.addCase(fetchUpdateDeleteHotel.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
      createToast(action.error.message || 'Some thing wrong', 'error');
    });
    builder.addCase(fetchUpdateDeleteRoom.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
      createToast(action.error.message || 'Some thing wrong', 'error');
    });
  },
});

interface ICreateHotelRes {
  result: IHotel<IRoom[]>;
  accessToken?: string;
  refreshToken?: string;
}

export const fetchGetHotels = createAppAsyncThunk('hotel/fetchGetHotels', async () => {
  const response = await apiService.get<IResponse<IHotel<IRoom[]>[]>>(
    '/hotel/hotelier/me'
  );
  return response.data.data;
});

export const fetchCreateHotel = createAppAsyncThunk(
  'hotel/fetchCreateHotel',
  async (newHotel: ICreateHotel, { dispatch }) => {
    const response = await apiService.post<IResponse<ICreateHotelRes>>(
      '/hotel/create-hotel',
      {
        ...newHotel,
      }
    );

    if (response.data.data) {
      const { result, accessToken, refreshToken } = response.data.data;
      if (accessToken && refreshToken) {
        setAllCookie(false, {
          userId: result.userId as string,
          accessToken,
          refreshToken,
        });
        setHeaders();
        await dispatch(fetchUser());
      }
    }

    return response.data.data?.result;
  }
);

export const fetchCreateRoom = createAppAsyncThunk(
  'hotel/fetchCreateRoom',
  async ({
    hotelId,
    rooms,
    isCreateMulti = false,
  }: {
    hotelId: string;
    rooms: ICreateRoom[];
    isCreateMulti: boolean;
    index: number;
  }) => {
    const response = await apiService.post<IResponse<IRoom[]>>(
      `/hotel/create-room/${hotelId}`,
      {
        roomTypes: rooms,
        isCreateMulti,
      }
    );
    return { hotelId, rooms: response.data.data, isCreateMulti };
  }
);

export const fetchUpdateHotel = createAppAsyncThunk(
  'hotel/fetchUpdateHotel',
  async ({
    newUpdateHotel,
    index,
    id,
  }: {
    newUpdateHotel: ICreateHotel;
    index: number;
    id: string;
  }) => {
    const convert = getDeleteFilter(['roomTypes'], newUpdateHotel);
    await apiService.put(`/hotel/update-hotel/${id}`, {
      ...convert,
    });
    return { newUpdateHotel, index };
  }
);

export const fetchUpdateDeleteHotel = createAppAsyncThunk(
  'hotel/fetchUpdateDeleteHotel',
  async ({ index, isDelete, id }: { index: number; isDelete?: boolean; id: string }) => {
    await apiService.put<IResponse<IHotel<IRoom[]>>>(`/hotel/update-hotel/${id}`, {
      isDelete,
    });
    return { isDelete, index };
  }
);

export const fetchUpdateDeleteRoom = createAppAsyncThunk(
  'hotel/fetchUpdateDeleteRoom',
  async ({
    idHotel,
    listId, // danh sách id room k delete
    idDelete,
  }: {
    listId: string[];
    idDelete: string;
    idHotel: string;
  }) => {
    await apiService.put<IResponse<IHotel<IRoom[]>>>(`/hotel/update-hotel/${idHotel}`, {
      roomTypeIds: listId,
    });
    return { idHotel, idDelete };
  }
);
export const fetchUpdateRoom = createAppAsyncThunk(
  'hotel/fetchUpdateRoom',
  async ({ newUpdateRoom, id }: { newUpdateRoom: ICreateRoom; id: string }) => {
    await apiService.put<IResponse<IUser>>(`/hotel/update-room/${id}`, {
      ...newUpdateRoom,
    });
    return { data: newUpdateRoom, id };
  }
);

export const { setTarget } = hotelSlice.actions;

export default hotelSlice.reducer;
