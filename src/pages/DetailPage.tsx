import React from 'react';
import RateReviewIcon from '@mui/icons-material/RateReview';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LuggageIcon from '@mui/icons-material/Luggage';
import Payment from '@reducer/payment/Payment';
import Overview from '@components/detailPage/Overview';
import { Container, Stack, Box } from '@mui/material';
import { useSelector, shallowEqual } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ColorTabs from '@components/ColorTabs';
import { RootState, useAppDispatch } from '@app/store';
import { fetchGetHotels, setTarget } from '@reducer/hotel/hotel.slice';
import Review from '@reducer/review/Review';
import {
  fetchCountBookingAtHotel,
  fetchGetBookingsByHotelier,
} from '@/reducer/payment/payment.slice';
import { EStatusIBooking } from '@/utils/enum';
import { fetchGetReviewNoReview } from '@/reducer/review/review.slice';

function DetailPage() {
  const { targetHotel, myHotels } = useSelector((state: RootState) => state.hotel);
  const tabs = [
    {
      icon: <VisibilityIcon />,
      name: 'Overview',
      component: <Overview targetHotel={targetHotel} />,
    },
    {
      icon: <LuggageIcon />,
      name: 'Bookings',
      component: <Payment targetHotel={targetHotel} />,
    },
    {
      icon: <RateReviewIcon />,
      name: 'Reviews',
      component: <Review targetHotel={targetHotel} />,
    },
  ];

  const [nameComponent, setNameComponent] = React.useState<string>(tabs[0].name);
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setNameComponent(newValue);
  };
  const { is2FA } = useSelector((state: RootState) => state.auth);
  const { typeReview, countReview } = useSelector(
    (state: RootState) => ({
      reviews: state.review.reviews,
      typeReview: state.review.typeReview,
      countReview: state.review.count,
    }),
    shallowEqual
  );

  const countBookingSuccess = useSelector(
    (state: RootState) => state.payment.countBookingSuccess,

    shallowEqual
  );
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const index = Number(searchParams.get('index'));
  const hotelId = searchParams.get('hotelId');

  React.useEffect(() => {
    if (!Number.isNaN(index) && hotelId && !myHotels.length) {
      if (is2FA) dispatch(fetchGetHotels());
    }
  }, [index, hotelId, myHotels]);

  React.useEffect(() => {
    if (!Number.isNaN(index) && hotelId && myHotels.length > 0) {
      if (!targetHotel && index < myHotels.length) {
        dispatch(setTarget(index));
        dispatch(
          fetchGetBookingsByHotelier({
            allHotel: false,
            hotelId: myHotels[index]._id,
            page: 1,
            status: EStatusIBooking.SUCCESS,
          })
        );

        setTimeout(
          () =>
            dispatch(
              fetchGetReviewNoReview({
                page: 1,
                hotelId: myHotels[index]._id,
                typeReview: 'reviewNoReply',
              })
            ),
          1500
        );
      }

      if (targetHotel) {
        dispatch(
          fetchGetBookingsByHotelier({
            allHotel: false,
            hotelId: myHotels[index]._id,
            page: 1,
            status: EStatusIBooking.SUCCESS,
          })
        );

        setTimeout(
          () =>
            dispatch(
              fetchGetReviewNoReview({
                page: 1,
                hotelId: myHotels[index]._id,
                typeReview: 'reviewNoReply',
              })
            ),
          1500
        );
      }
    }
  }, [index, hotelId, myHotels.length]);

  const numberBookingSuccessRef = React.useRef<number>(0);
  const numberReviewNoReplyRef = React.useRef<number>(0);

  if (typeReview === 'reviewNoReply' && countReview !== numberReviewNoReplyRef.current) {
    numberReviewNoReplyRef.current = countReview;
  }

  if (numberBookingSuccessRef.current !== countBookingSuccess) {
    numberBookingSuccessRef.current = countBookingSuccess;
  }

  React.useEffect(() => {
    let alertInterval: null | NodeJS.Timeout = null;
    if (hotelId && !alertInterval) {
      alertInterval = setInterval(
        () => dispatch(fetchCountBookingAtHotel(hotelId)),
        8000
      );
    }
    return () => {
      if (alertInterval) clearInterval(alertInterval);
    };
  }, []);

  return (
    <Container maxWidth={false} disableGutters>
      <Stack
        mt={8.5}
        minHeight='60vh'
        maxWidth='80vw'
        columnGap={2}
        alignItems='center'
        mx='auto'
      >
        <Box
          sx={{
            pl: 2,
            border: 'none',
            borderRadius: '0px',
          }}
        >
          <ColorTabs
            numberBadge={[
              0,
              numberBookingSuccessRef.current,
              numberReviewNoReplyRef.current,
            ]}
            tabs={tabs}
            value={nameComponent}
            handleChange={handleChange}
            orientation='horizontal'
            sx={{ borderColor: 'divider' }}
          />
        </Box>
        {tabs.map(
          (tab) =>
            tab.name === nameComponent && (
              <Box sx={{ mt: 1, width: '100%' }} key={tab.name}>
                {tab.component}
              </Box>
            )
        )}
      </Stack>
    </Container>
  );
}
export default DetailPage;
