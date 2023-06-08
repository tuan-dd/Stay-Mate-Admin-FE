/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Box, Stack, Typography } from '@mui/material';
import ColorTabs from '@components/ColorTabs';
import { throttle } from '@utils/utils';
import { EStatusIBooking } from '@/utils/enum';
import { RootState, useAppDispatch } from '@/app/store';
import CardBooking from './CardBooking';
import { fetchGetBookingsByHotelier } from './payment.slice';
import { IHotel, IRoom } from '@/utils/interface';

const tabs = [
  { name: 'paid', statusPayment: EStatusIBooking.SUCCESS },
  { name: 'stayed', statusPayment: EStatusIBooking.STAY },
  { name: 'decline', statusPayment: EStatusIBooking.DECLINE },
  { name: 'cancel', statusPayment: EStatusIBooking.CANCEL },
];

function Payment({ targetHotel }: { targetHotel: IHotel<IRoom[]> | null }) {
  const [statusBooking, setStatusBooking] = React.useState<string>(tabs[0].name);
  const [page, setPage] = React.useState<number>(1);

  const { bookings, errorMessage } = useSelector(
    (state: RootState) => ({
      bookings: state.payment.bookings,
      errorMessage: state.payment.errorMessage,
    }),
    shallowEqual
  );
  const dispatch = useAppDispatch();
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setStatusBooking(newValue);
  };

  const index = tabs.findIndex((tab) => tab.name === statusBooking);

  React.useEffect(() => {
    if (targetHotel) {
      if (statusBooking === 'paid') {
        dispatch(
          fetchGetBookingsByHotelier({
            allHotel: false,
            page: 1,
            status: EStatusIBooking.SUCCESS,
            hotelId: targetHotel._id,
          })
        );
      } else if (index > -1) {
        dispatch(
          fetchGetBookingsByHotelier({
            allHotel: false,
            page: 1,
            status: tabs[index].statusPayment,
            hotelId: targetHotel._id,
          })
        );
      }
    }
    setPage(1);
  }, [statusBooking, targetHotel]);

  const fetchPage = () => {
    if (errorMessage.length && bookings.length)
      return window.removeEventListener('scroll', tHandler);

    if (index > -1 && targetHotel) {
      setPage(page + 1);
      return dispatch(
        fetchGetBookingsByHotelier({
          page: page + 1,
          status: tabs[index].statusPayment,
          allHotel: false,
          hotelId: targetHotel._id,
        })
      );
    }
    return false;
  };

  const onScroll = () => {
    const heightScroll = window.scrollY + window.innerHeight;

    if (heightScroll > (document.documentElement.scrollHeight * 18) / 20) fetchPage();
  };

  const tHandler = throttle(onScroll, 300);

  React.useEffect(() => {
    if (page === 1 && bookings.length) {
      window.addEventListener('scroll', tHandler);
    }
    return () => window.removeEventListener('scroll', tHandler);
  }, [page, bookings]);

  return (
    <>
      <Stack mt={3} flexDirection='row' columnGap={5} marginX='auto' width='80%'>
        <ColorTabs
          tabs={tabs}
          numberBadge={[]}
          value={statusBooking}
          handleChange={handleChange}
          orientation='vertical'
          sxTab={{ justifyContent: 'center', minWidth: 150, p: 0 }}
        />
        <Stack spacing={3} width='100%'>
          {bookings.length ? (
            bookings.map((booking, i) => (
              <Box key={i}>
                <CardBooking booking={booking} i={i} />
              </Box>
            ))
          ) : (
            <Box>
              <Typography>Not booking</Typography>
            </Box>
          )}
        </Stack>
      </Stack>
    </>
  );
}

export default Payment;
