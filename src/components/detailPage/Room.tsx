import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import Button from '@mui/material/Button';
import { z } from 'zod';
import CheckIcon from '@mui/icons-material/Check';
import { Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { nameIcons, urlIcons, urlImagesRooms, urlImagesRoomsLove } from '@/utils/images';
import ModalImages from '../modal/ModalImages';
import ModalAmenities from '../modal/ModalAmenities';
import { RootState, useAppDispatch } from '@/app/store';
import { IHotel, IRoom } from '@/utils/interface';
import ModalCreateOrUpdateRoom from '../modal/ModalCreateOrUpdateRoom';
import { ICreateRoom } from '../modal/ModalCreateOrUpdateHotel';
import { fetchUpdateDeleteRoom, fetchUpdateRoom } from '@/reducer/hotel/hotel.slice';
import { EStatusRedux } from '@/utils/enum';
import IconClose from '../IconClose';

const isUrl = z.string().url();

interface IAmenities {
  name: string;
  url: string | boolean;
}

export default function Rooms({ dateHotel }: { dateHotel: IHotel<IRoom[]> }) {
  const [isOpenModalImages, setIsOpenModalImages] = React.useState<boolean>(false);
  const [isOpenModalAmenities, setIsOpenModalAmenities] = React.useState<boolean>(false);
  const [isOpenModalRoom, setIsOpenModalRoom] = React.useState<boolean>(false);
  const imagesByRoomRef = React.useRef<string[]>([]);
  const amenitiesByRoomRef = React.useRef<IAmenities[]>([]);
  const roomRef = React.useRef<IRoom | undefined>(undefined);
  const rooms = dateHotel.roomTypeIds;
  const dispatch = useAppDispatch();
  const { status } = useSelector((state: RootState) => state.hotel);
  const disableHotel = dateHotel.isDelete;

  const convertImagesRoom = React.useMemo<string[][]>(() => {
    const images = rooms.map((e, i) => {
      if (isUrl.safeParse(e.images[0]).success) {
        return e.images;
      }
      return i === 0 ? [...urlImagesRoomsLove] : [...urlImagesRooms];
    });
    return images;
  }, [rooms]);

  const roomsAmenities = React.useMemo<
    { name: string; url: string | boolean }[][]
  >(() => {
    const result = rooms?.map((e) => {
      const convertIconInRateDescription: { name: string; url: string | boolean }[] = [];
      e.rateDescription?.split(',').forEach((value) => {
        const indexIcon = nameIcons.findIndex((i) => value.includes(i));

        if (indexIcon > -1) {
          convertIconInRateDescription.push({ name: value, url: urlIcons[indexIcon] });
        }
      });

      const convertIcon =
        e.roomAmenities?.map((amenities) => {
          const indexIcon = nameIcons.findIndex((i) => i === amenities);
          return indexIcon > -1
            ? { name: amenities, url: urlIcons[indexIcon] }
            : { name: amenities, url: false };
        }) || [];

      return [...convertIcon, ...convertIconInRateDescription];
    });

    return result;
  }, [rooms]);

  function handelOpenImages(i: number) {
    setIsOpenModalImages(true);

    imagesByRoomRef.current = [...convertImagesRoom[i]]; // truyền undefine nó k copy
  }

  function handelOpenAmenities(i: number) {
    setIsOpenModalAmenities(true);
    amenitiesByRoomRef.current = [...roomsAmenities[i]];
  }

  function handelOpenRoom(i: number) {
    setIsOpenModalRoom(true);
    roomRef.current = { ...dateHotel.roomTypeIds[i] };
  }

  const handelUpdateRoom = (newUpdateRoom: ICreateRoom) => {
    dispatch(fetchUpdateRoom({ newUpdateRoom, id: roomRef.current?._id as string }));
  };
  const handelDeleteRoom = (index: number) => {
    const newRoomTypeIds = dateHotel.roomTypeIds.map((room) => room._id);
    newRoomTypeIds.splice(index, 1);
    dispatch(
      fetchUpdateDeleteRoom({
        idHotel: dateHotel._id,
        listId: [...newRoomTypeIds],
        idDelete: dateHotel.roomTypeIds[index]._id,
      })
    );
  };

  return (
    <Box>
      {rooms.map((room, i) => (
        <Card
          key={`${room.nameOfRoom}_${i}`}
          sx={{
            width: '100%%',
            border: 'solid 0.5px',
            my: 2,
            p: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Stack flexDirection='row' columnGap={2} alignItems='center'>
            <Stack minWidth='400px'>
              <ImageList variant='quilted' cols={2} rowHeight={70} sx={{ m: 0 }}>
                {convertImagesRoom[i].slice(0, 3).map((item, index) => (
                  <ImageListItem
                    sx={{
                      cursor: 'pointer',
                    }}
                    key={index}
                    cols={index === 0 ? 2 : 1}
                    rows={index === 0 ? 2 : 1}
                    onClick={() => handelOpenImages(i)}
                  >
                    <img src={item} alt={room.nameOfRoom} loading='lazy' />
                  </ImageListItem>
                ))}
              </ImageList>
              <Button
                onClick={() => handelOpenImages(i)}
                sx={{
                  bgcolor: 'common.onBackground',
                  '&:hover': {
                    bgcolor: 'common.onBackground',
                    color: 'primary.dark',
                  },
                }}
              >
                See all images
              </Button>
            </Stack>
            <Divider orientation='vertical' flexItem />
            <Stack minWidth={150} spacing={0.5}>
              <Typography variant='h6' color='primary.main'>
                Amenities
              </Typography>
              {roomsAmenities[i].slice(0, 6).map((e) => (
                <Box key={e.name}>
                  {e.url ? (
                    <img
                      src={e.url as string}
                      alt={e.name}
                      width='25px'
                      height='25px'
                      loading='lazy'
                    />
                  ) : (
                    <CheckIcon
                      sx={{
                        bgcolor: 'white',
                        color: 'secondary.main',
                        width: '25px',
                        height: '25px',
                      }}
                    />
                  )}
                  &nbsp;
                  <Typography component='span' variant='body2' fontSize={13}>
                    {e.name}
                  </Typography>
                </Box>
              ))}
              {roomsAmenities[i].length > 6 && (
                <Typography
                  color='primary'
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => handelOpenAmenities(i)}
                >
                  See More
                </Typography>
              )}
            </Stack>
            <Divider orientation='vertical' flexItem />
            <CardContent
              sx={{
                flexGrow: '1',
                p: 0,
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '50%',
              }}
            >
              <Typography
                gutterBottom
                variant='h4'
                textTransform='uppercase'
                color='primary.main'
              >
                {room.nameOfRoom}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {room.rateDescription}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                quantity :{room.numberOfRoom}
              </Typography>
              {room.mealType && (
                <Typography variant='body1' color='primary.dark'>
                  Extra: {room.mealType}
                </Typography>
              )}
              <Typography textAlign='center' variant='h5' color='blue' mt={2}>
                price: {room.price}
              </Typography>
            </CardContent>
          </Stack>
          <Box sx={{ position: 'absolute', right: 2, bottom: 2 }}>
            <Button disabled={disableHotel} onClick={() => handelOpenRoom(i)}>
              Edit
            </Button>
          </Box>
          <IconClose
            disabled={disableHotel}
            fontSize='small'
            onClick={() => handelDeleteRoom(i)}
          />
        </Card>
      ))}
      <ModalImages
        isOpenModal={isOpenModalImages}
        setIsOpenModal={setIsOpenModalImages}
        images={imagesByRoomRef.current}
      />
      <ModalAmenities
        isOpenModal={isOpenModalAmenities}
        setIsOpenModal={setIsOpenModalAmenities}
        amenities={amenitiesByRoomRef.current}
      />
      <ModalCreateOrUpdateRoom
        isOpenModal={isOpenModalRoom}
        setIsOpenModal={setIsOpenModalRoom}
        room={roomRef.current}
        handelSubmit={handelUpdateRoom}
        pending={status === EStatusRedux.pending}
      />
    </Box>
  );
}
