import React from 'react';
import Card from '@mui/material/Card';
import { z } from 'zod';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IHotel, IRoom } from '@utils/interface';
import { urlImagesRooms, urlImagesRoomsLove, urlImagesTrending } from '@utils/images';
import ModalImages from '../modal/ModalImages';
import { useAppDispatch } from '@/app/store';
import { setTarget } from '@/reducer/hotel/hotel.slice';

const isUrl = z.string().url();
function CardHotel({ hotel, index }: { hotel: IHotel<IRoom[]>; index: number }) {
  const [isOpenModalImages, setIsOpenModalImages] = React.useState<boolean>(false);
  const imagesHotel = React.useMemo<string[]>(
    () =>
      isUrl.safeParse(hotel.images[0]).success
        ? hotel.images
        : [urlImagesTrending[index], ...urlImagesRoomsLove, ...urlImagesRooms],
    []
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const roomOffer = React.useMemo<string | undefined>(() => {
    const i = hotel.roomTypeIds.findIndex((room) => room.mealType);
    return i > -1 ? hotel.roomTypeIds[i].mealType : undefined;
  }, []);

  return (
    <Card sx={{ cursor: 'pointer' }}>
      <CardActionArea>
        <Stack flexDirection='row' columnGap={1}>
          <Box sx={{ width: 300 }}>
            <ImageList
              variant='quilted'
              cols={4}
              rowHeight={45}
              sx={{ m: 0, width: 300 }}
            >
              {imagesHotel.slice(0, 4).map((item, i) => (
                <ImageListItem
                  sx={{
                    cursor: 'pointer',
                  }}
                  key={i}
                  cols={i === 0 ? 4 : 1}
                  rows={i === 0 ? 4 : 1}
                  onClick={() => setIsOpenModalImages(true)}
                >
                  <img src={item} alt={hotel.hotelName} loading='lazy' />
                </ImageListItem>
              ))}
              {imagesHotel.length > 4 && (
                <ImageListItem
                  sx={{
                    cursor: 'pointer',
                  }}
                  key={4}
                  cols={1}
                  rows={1}
                  onClick={() => setIsOpenModalImages(true)}
                >
                  <img src={imagesHotel[4]} alt={hotel.hotelName} loading='lazy' />
                </ImageListItem>
              )}
              {roomOffer && (
                <Box
                  sx={{
                    position: 'absolute',
                    width: 'auto',
                    p: 0.5,
                    zIndex: 3,
                    height: 'auto',
                    margin: '10px -2px',
                    borderRadius: 5,
                    bgcolor: 'success.darker',
                  }}
                >
                  <div>
                    <Typography variant='body2' color='success.contrastText'>
                      {roomOffer}
                    </Typography>
                  </div>
                </Box>
              )}
            </ImageList>
          </Box>
          <Box
            sx={{ flexGrow: 1 }}
            onClick={() => {
              dispatch(setTarget(index));
              navigate(`/detail?hotelId=${hotel._id}&index=${index}`);
            }}
          >
            <Stack spacing={1} mt={1}>
              <Typography>{hotel.hotelName}</Typography>
              <Rating readOnly value={hotel.star} size='small' />
              <Typography>Address: {hotel.address}</Typography>
              <Typography>Type: {hotel.propertyType}</Typography>
            </Stack>
          </Box>
          <Divider orientation='vertical' flexItem />
          <Box
            sx={{ minWidth: 230 }}
            onClick={() => {
              dispatch(setTarget(index));
              navigate(`/detail?hotelId=${hotel._id}&index=${index}`);
            }}
          >
            <Stack justifyContent='space-around' alignItems='center' height='100%'>
              <Box>
                <Typography>
                  Star Rating:&nbsp;&nbsp;&nbsp;&nbsp;
                  <Typography
                    component='span'
                    variant='h2'
                    fontWeight='600'
                    color='success.light'
                  >
                    {(hotel.starRating.starAverage / 5) * 10}
                  </Typography>
                </Typography>
                {hotel.starRating.countReview > 0 ? (
                  <Typography>Count: {hotel.starRating.countReview}</Typography>
                ) : (
                  <Typography variant='body2'>There are no reviews yet</Typography>
                )}
              </Box>
            </Stack>
          </Box>
        </Stack>
      </CardActionArea>
      <ModalImages
        isOpenModal={isOpenModalImages}
        setIsOpenModal={setIsOpenModalImages}
        images={imagesHotel}
      />
    </Card>
  );
}

export default CardHotel;
