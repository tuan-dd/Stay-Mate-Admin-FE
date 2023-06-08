/* eslint-disable @typescript-eslint/no-use-before-define */
import { createSlice } from '@reduxjs/toolkit';

import { createAppAsyncThunk } from '../user/user.slice';
import apiService from '@/app/server';
import { IResponse, IReview } from '@/utils/interface';
import { EStatusRedux } from '@/utils/enum';
import { createToast } from '@/utils/utils';

export interface IReviewRedux {
  status: EStatusRedux;
  count: number;
  reviews: IReview[];
  replies: IReview[];
  typeReview: 'reviewNoReply' | 'reviewHadReply';
  errorMessage: string;
  page: number;
}

const initialState: IReviewRedux = {
  status: EStatusRedux.idle,
  typeReview: 'reviewNoReply',
  reviews: [],
  replies: [],
  errorMessage: '',
  count: 0,
  page: 1,
};

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCreateReply.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchGetReviewNoReview.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchGetReviewHadReview.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchGetReplyHotelier.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });
    builder.addCase(fetchUpdateReply.pending, (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    });

    builder.addCase(fetchCreateReply.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      const { data, index } = action.payload;
      if (data) {
        state.reviews[index].isReply = true;
        state.reviews[index].reply = data;
      }
      if (state.typeReview === 'reviewNoReply') {
        state.count -= 1;
      }
      createToast('Create reply successfully', 'success');
    });
    builder.addCase(fetchGetReviewNoReview.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      const { page, data, typeReview } = action.payload;
      if (data) {
        if (page === 1) {
          state.reviews = data.reviews;
        }
        if (page !== state.page) state.reviews = state.reviews.concat([...data.reviews]);
        state.count = data.count;
        state.typeReview = typeReview;
        state.page = page;
      }
    });
    builder.addCase(fetchGetReviewHadReview.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      const { page, data, typeReview } = action.payload;
      if (data) {
        const replies = data.reviews.filter((value) => value.parent_slug);
        const reviews = data.reviews.filter((value) => !value.parent_slug);
        const combine = reviews.map((review) => {
          const value = replies.find((reply) => reply.parent_slug === review.slug);
          review.reply = value;
          return review;
        });
        if (page === 1) {
          state.reviews = combine;
        }
        if (page !== state.page) state.reviews = state.reviews.concat([...combine]);
        state.count = data.count;
        state.typeReview = typeReview;
        state.page = page;
      }
    });

    builder.addCase(fetchGetReplyHotelier.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload) {
        state.replies = state.reviews.concat([...action.payload.reviews]);
      }
    });

    builder.addCase(fetchUpdateReply.fulfilled, (state, action) => {
      state.status = EStatusRedux.succeeded;

      const { context, index, starRating, isDelete } = action.payload;
      const { reply } = state.reviews[index];

      if (isDelete) {
        state.reviews[index].reply = undefined;
        createToast('Delete reply successfully', 'warning');
      }
      if (reply) {
        reply.context = context;
        reply.starRating = starRating;
        createToast('Update reply successfully', 'success');
      }
    });

    builder.addCase(fetchCreateReply.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
      createToast('Can`t create reply', 'error');
    });
    builder.addCase(fetchGetReviewNoReview.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      if (state.typeReview !== action.meta.arg.typeReview) {
        state.reviews = [];
        state.count = 0;
      }
      state.typeReview = action.meta.arg.typeReview;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchGetReviewHadReview.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      if (state.typeReview !== action.meta.arg.typeReview) {
        state.reviews = [];
        state.count = 0;
      }
      state.typeReview = action.meta.arg.typeReview;
      state.errorMessage = action.error.message || 'some thing wrong';
    });
    builder.addCase(fetchUpdateReply.rejected, (state, action) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.error.message || 'some thing wrong';
      createToast('Can`t update reply', 'error');
    });
  },
});

interface IResReviews {
  reviews: IReview[];
  count: number;
}

export const fetchGetReviewNoReview = createAppAsyncThunk(
  'review/fetchGetReviewNoReview',
  async ({
    page,
    hotelId,
    typeReview = 'reviewNoReply',
  }: {
    page: number;
    hotelId: string;
    typeReview: 'reviewNoReply';
  }) => {
    const response = await apiService.get<IResponse<IResReviews>>('review/hotelier', {
      params: { typeReview, page, hotelId },
    });

    return { data: response.data.data, page, typeReview };
  }
);

export const fetchGetReviewHadReview = createAppAsyncThunk(
  'review/fetchGetReviewHadReview',
  async ({
    page,
    hotelId,
    typeReview = 'reviewHadReply',
  }: {
    page: number;
    hotelId: string;
    typeReview: 'reviewHadReply';
  }) => {
    const response = await apiService.get<IResponse<IResReviews>>('review/hotelier', {
      params: { typeReview, page, hotelId },
    });
    return { data: response.data.data, page, typeReview };
  }
);

export const fetchGetReplyHotelier = createAppAsyncThunk(
  'review/fetchGetReplyHotelier',
  async ({
    page,
    hotelId,
    typeReview = 'reply',
  }: {
    page: number;
    hotelId: string;
    typeReview?: 'reply';
  }) => {
    const response = await apiService.get<IResponse<IResReviews>>('review/hotelier', {
      params: { typeReview, page, hotelId },
    });
    return response.data.data;
  }
);

export const fetchCreateReply = createAppAsyncThunk(
  'review/fetchCreateReply',
  async ({
    id,
    context,
    starRating,
    parent_slug,
    hotelId,
    index,
  }: {
    id: string;
    context: string;
    starRating: number;
    parent_slug: string;
    hotelId: string;
    index: number;
  }) => {
    const response = await apiService.post<IResponse<IReview>>(`review/${id}`, {
      context,
      parent_slug,
      hotelId,
      starRating,
    });
    return { data: response.data.data, index };
  }
);

export const fetchUpdateReply = createAppAsyncThunk(
  'review/fetchUpdateReply',
  async ({
    id,
    context,
    starRating,
    isDelete = false,
    index,
  }: {
    id: string;
    context: string;
    starRating: number;
    isDelete: boolean;
    index: number;
  }) => {
    await apiService.put<IResponse<IReview[]>>(`review/${id}`, {
      context,
      starRating,
      isDelete,
    });

    return {
      context,
      starRating,
      isDelete,
      index,
    };
  }
);

export default reviewSlice.reducer;
