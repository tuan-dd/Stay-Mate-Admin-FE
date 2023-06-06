import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Stack, Typography, Box, Button, Alert } from '@mui/material';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import CardHotel from '@components/homepage/CardHotel';
import { fetchCreateHotel, fetchGetHotels } from '@reducer/hotel/hotel.slice';
import { RootState, useAppDispatch } from '@app/store';
import ModalCreateOrUpdateHotel, {
  ICreateHotel,
} from '@components/modal/ModalCreateOrUpdateHotel';
import { EPackage, ERole } from '@/utils/enum';

function ListHotel() {
  const [isOpenModalFormHotel, setIsOpenModalFormHotel] = React.useState<boolean>(false);

  const myHotels = useSelector((state: RootState) => state.hotel.myHotels, shallowEqual);
  const roleUser = useSelector((state: RootState) => state.user.role, shallowEqual);

  const refLength = React.useRef<number>(myHotels.length);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!myHotels.length && roleUser === ERole.HOTELIER) dispatch(fetchGetHotels());
  }, [roleUser]);

  const handelSubmit = (data: ICreateHotel) => {
    dispatch(fetchCreateHotel(data));
  };

  React.useEffect(() => {
    if (refLength.current !== myHotels.length) {
      refLength.current = myHotels.length;
      setIsOpenModalFormHotel(false);
    }
  }, [myHotels.length]);

  return (
    <>
      {myHotels.length > 0 ? (
        <Stack
          minHeight='70vh'
          width='60vw'
          m='auto'
          mb={2}
          mt={15}
          spacing={2}
          justifyContent='center'
        >
          {myHotels[0].package === EPackage.FREE && (
            <Alert severity='warning' sx={{ fontSize: 20 }}>
              Your hotel is temporary lock, upgrade memberShip to earn money
            </Alert>
          )}
          {myHotels.map((hotel, i) => (
            <Box key={i}>
              <CardHotel hotel={hotel} index={i} />
            </Box>
          ))}
          <></>
          <Button
            startIcon={<AddHomeWorkIcon fontSize='large' />}
            onClick={() => setIsOpenModalFormHotel(true)}
          >
            <Typography variant='h5'>Add hotel</Typography>
          </Button>
        </Stack>
      ) : (
        <Stack minHeight='70vh' m='auto' mt={15}>
          <Button onClick={() => setIsOpenModalFormHotel(true)}>
            <Typography variant='h3'>Create Hotel now</Typography>
          </Button>
        </Stack>
      )}
      <ModalCreateOrUpdateHotel
        isOpenModal={isOpenModalFormHotel}
        setIsOpenModal={setIsOpenModalFormHotel}
        hotel={undefined}
        handelSubmit={handelSubmit}
      />
    </>
  );
}

export default ListHotel;
