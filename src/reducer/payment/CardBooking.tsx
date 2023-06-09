import { Box, Card, Stack, Typography, Alert } from '@mui/material';
import { urlImagesTrending } from '@/utils/images';
import { fDate } from '@/utils/formatTime';

import { IBookingResCustom } from './payment.slice';

function CardBooking({ booking, i }: { booking: IBookingResCustom; i: number }) {
  return (
    <Card>
      <Stack flexDirection='row'>
        <Box>
          <img
            src={urlImagesTrending[i]}
            alt={booking.hotelId.hotelName}
            width='250px'
            height='250'
          />
        </Box>
        <Box padding={1.5} flexGrow={1}>
          <Stack flexDirection='row'>
            <Stack spacing={1} flexGrow={1} width='100%'>
              <Typography textTransform='capitalize' color='primary' fontSize={18}>
                {booking.hotelId.hotelName}
              </Typography>
              <Typography fontSize={14}>
                Reservation code: {booking._id?.slice(10)}
              </Typography>
              <Typography fontSize={14} color='Highlight'>
                Booker`s name: {booking.userId?.name}
              </Typography>
              <Typography fontSize={14} color='Highlight'>
                Booker`s email: {booking.userId?.email}
              </Typography>
              <Alert severity='success' sx={{ bgcolor: 'transparent', p: 0 }}>
                {booking.status}
              </Alert>
            </Stack>
            <Stack
              flexDirection='row'
              columnGap={1}
              flexGrow={0}
              minWidth={240}
              justifyContent='flex-end'
            >
              <Box>
                <Typography textAlign='center' variant='body2'>
                  Check in
                </Typography>
                <Typography fontSize={14}>
                  {fDate(booking.startDate, 'HH:mm-DD-MM-YYYY')}
                </Typography>
              </Box>
              <Box>
                <Typography textAlign='center' variant='body2'>
                  Check out
                </Typography>
                <Typography fontSize={14}>
                  {fDate(booking.endDate, 'HH:mm-DD-MM-YYYY')}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}

export default CardBooking;
