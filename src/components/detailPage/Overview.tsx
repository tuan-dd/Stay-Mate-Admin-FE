import React from 'react';

import { shallowEqual, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Box, Stack, Typography, Button } from '@mui/material';

import Rooms from '@components/detailPage/Room';
import ModalCreateOrUpdateHotel, {
  ICreateHotel,
  ICreateRoom,
} from '@components/modal/ModalCreateOrUpdateHotel';
import {
  fetchCreateRoom,
  fetchUpdateDeleteHotel,
  fetchUpdateHotel,
} from '@reducer/hotel/hotel.slice';
import { EStatusRedux } from '@utils/enum';

import { RootState, useAppDispatch } from '@app/store';

import { fToNow } from '@utils/formatTime';
import CardDetailHotel from '@components/detailPage/CardDetailHotel';
import { IHotel, IRoom } from '@/utils/interface';
import ModalCreateOrUpdateRoom from '../modal/ModalCreateOrUpdateRoom';

function Overview({ targetHotel }: { targetHotel: IHotel<IRoom[]> | null }) {
  const [isOpenModalFormHotel, setIsOpenModalFormHotel] = React.useState<boolean>(false);

  const [isOpenModalFormRoom, setIsOpenModalFormRoom] = React.useState<boolean>(false);
  const status = useSelector((state: RootState) => state.hotel.status, shallowEqual);

  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const index = Number(searchParams.get('index'));

  const handelUpdateHotel = (data: ICreateHotel) => {
    dispatch(
      fetchUpdateHotel({ newUpdateHotel: data, index, id: targetHotel?._id as string })
    );
  };

  const handelCreateRoom = (data: ICreateRoom) => {
    dispatch(
      fetchCreateRoom({
        rooms: [data],
        index,
        hotelId: targetHotel?._id as string,
        isCreateMulti: false,
      })
    );
  };

  return (
    <>
      <Box width='100%' mt={10}>
        <Stack justifyContent='center' alignItems='center' mt={10}>
          <Typography variant='h4' mb={5}>
            {targetHotel?.hotelName}
          </Typography>
          {targetHotel?.isDelete && (
            <Box>
              <Typography component='span'>
                This {`${targetHotel?.hotelName}`} hotel was closed down{' '}
                {fToNow(targetHotel?.createdAt, new Date())}, Do you want to open it?
              </Typography>
              <Button
                sx={{ textDecoration: 'underline' }}
                onClick={() =>
                  dispatch(
                    fetchUpdateDeleteHotel({
                      index,
                      isDelete: false,
                      id: targetHotel?._id as string,
                    })
                  )
                }
              >
                open it
              </Button>
            </Box>
          )}
          {targetHotel && (
            <CardDetailHotel
              targetHotel={targetHotel}
              setIsOpenModalFormHotel={setIsOpenModalFormHotel}
              index={index}
            />
          )}
          <Typography variant='h4' my={5}>
            Room types : {targetHotel?.roomTypeIds.length}
          </Typography>
          {targetHotel && <Rooms dateHotel={targetHotel} />}
          <Button
            variant='contained'
            sx={{ fontSize: 25 }}
            onClick={() => setIsOpenModalFormRoom(true)}
          >
            Create new room
          </Button>
        </Stack>
        <ModalCreateOrUpdateHotel
          isOpenModal={isOpenModalFormHotel}
          setIsOpenModal={setIsOpenModalFormHotel}
          hotel={targetHotel || undefined}
          handelSubmit={handelUpdateHotel}
          pending={status === EStatusRedux.pending}
        />
        <ModalCreateOrUpdateRoom
          isOpenModal={isOpenModalFormRoom}
          setIsOpenModal={setIsOpenModalFormRoom}
          room={undefined}
          handelSubmit={handelCreateRoom}
          pending={status === EStatusRedux.pending}
        />
      </Box>
    </>
  );
}

export default Overview;
