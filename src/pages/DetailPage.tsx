import React from 'react';
import RateReviewIcon from '@mui/icons-material/RateReview';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LuggageIcon from '@mui/icons-material/Luggage';
import Payment from '@reducer/payment/Payment';
import Overview from '@components/detailPage/Overview';
import { Container, Stack, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ColorTabs from '@components/ColorTabs';
import { RootState, useAppDispatch } from '@app/store';
import { fetchGetHotels, setTarget } from '@reducer/hotel/hotel.slice';
import Review from '@reducer/review/Review';

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
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const index = Number(searchParams.get('index'));
  const bookingId = searchParams.get('bookingId');

  React.useEffect(() => {
    if (!Number.isNaN(index) && bookingId && !myHotels.length) {
      if (is2FA) dispatch(fetchGetHotels());
    }
  }, [index, bookingId, myHotels]);

  React.useEffect(() => {
    if (!Number.isNaN(index) && bookingId && myHotels.length > 0) {
      if (!targetHotel && index < myHotels.length) {
        dispatch(setTarget(index));
      }
    }
  }, [index, bookingId, myHotels]);

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
