/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Stack, Typography } from '@mui/material';
import { RootState, useAppDispatch } from '@/app/store';
import ColorTabs from '@/components/ColorTabs';
import CardReview from './CardReview';
import {
  fetchGetReviewNoReview,
  fetchGetReviewHadReview,
  fetchUpdateReply,
  fetchCreateReply,
} from './review.slice';
import { throttle } from '@/utils/utils';
import FromModalReview from './FromModalReview';
import { IReview, IHotel, IRoom } from '@/utils/interface';
import { EStatusRedux } from '@/utils/enum';

const tabs = [
  { name: 'UnReply', isParent_slug: false },
  { name: 'Replied', isParent_slug: true },
];
function Review({ targetHotel }: { targetHotel: IHotel<IRoom[]> | null }) {
  const [typeReview, setTypeReview] = React.useState<string>(tabs[0].name);
  const [page, setPage] = React.useState<number>(1);
  const dispatch = useAppDispatch();
  const { reviews, errorMessage, status } = useSelector(
    (state: RootState) => state.review
  );
  const [isOpenModalFrom, setIsOpenModalFrom] = React.useState<boolean>(false);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTypeReview(newValue);
  };

  const targetReviewRef = React.useRef<IReview | undefined>(undefined);
  const indexRefReply = React.useRef<number>(-1);

  const handelClickTargetReview = (i: number) => {
    if (reviews[i].isReply && reviews[i].reply) {
      setIsOpenModalFrom(true);
      targetReviewRef.current = reviews[i].reply;
    } else {
      setIsOpenModalFrom(true);
      targetReviewRef.current = undefined;
    }
    indexRefReply.current = i;
  };

  const handelUpdateOrCreateReply = (data: string) => {
    const { reply, isReply, starRating, slug, hotel, _id } =
      reviews[indexRefReply.current];
    if (reply && isReply) {
      dispatch(
        fetchUpdateReply({
          id: reply._id,
          context: data,
          starRating,
          isDelete: false,
          index: indexRefReply.current,
        })
      );
    } else if (!isReply) {
      dispatch(
        fetchCreateReply({
          hotelId: hotel.hotelId,
          parent_slug: slug,
          starRating,
          id: _id,
          context: data,
          index: indexRefReply.current,
        })
      );
    }
  };

  React.useEffect(() => {
    if (targetHotel) {
      typeReview === 'UnReply'
        ? dispatch(
            fetchGetReviewNoReview({
              page: 1,
              hotelId: targetHotel._id,
              typeReview: 'reviewNoReply',
            })
          )
        : dispatch(
            fetchGetReviewHadReview({
              page: 1,
              hotelId: targetHotel._id,
              typeReview: 'reviewHadReply',
            })
          );
    }

    setPage(1);
  }, [typeReview]);

  const fetchPage = () => {
    if (errorMessage || !reviews.length || status === EStatusRedux.pending)
      return window.removeEventListener('scroll', tHandler);

    setPage(page + 1);
    if (targetHotel) {
      return typeReview === 'UnReply'
        ? dispatch(
            fetchGetReviewNoReview({
              page: 1,
              hotelId: targetHotel._id,
              typeReview: 'reviewNoReply',
            })
          )
        : dispatch(
            fetchGetReviewHadReview({
              page: 1,
              hotelId: targetHotel._id,
              typeReview: 'reviewHadReply',
            })
          );
    }
    return false;
  };

  const onScroll = () => {
    const heightScroll = window.scrollY + window.innerHeight;

    if (heightScroll > (document.documentElement.scrollHeight * 18) / 20) fetchPage();
  };

  const tHandler = throttle(onScroll, 400);

  React.useEffect(() => {
    if (page === 1 || !errorMessage.length) {
      window.addEventListener('scroll', tHandler);
    }
    return () => window.removeEventListener('scroll', tHandler);
  }, [page, reviews, errorMessage]);

  return (
    <Stack flexDirection='row' columnGap={4} width='85%' mx='auto' mt={4}>
      <ColorTabs
        tabs={tabs}
        value={typeReview}
        handleChange={handleChange}
        orientation='vertical'
        sxTab={{ justifyContent: 'center', minWidth: 150, p: 0 }}
      />
      <Stack spacing={2} mb={1} width='100%'>
        {reviews.length !== 0 ? (
          reviews.map((review, i) => (
            <Box key={i}>
              <CardReview
                review={review}
                i={i}
                handelClickTargetReview={handelClickTargetReview}
              />
            </Box>
          ))
        ) : (
          <Box>
            <Typography>No review</Typography>
          </Box>
        )}
      </Stack>
      <FromModalReview
        setIsOpenModal={setIsOpenModalFrom}
        isOpenModal={isOpenModalFrom}
        review={targetReviewRef.current}
        handelSubmit={handelUpdateOrCreateReply}
        pending={status === EStatusRedux.pending}
      />
    </Stack>
  );
}

export default Review;
