import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

import React from 'react';
import { z } from 'zod';
import IconClose from '../IconClose';
import { IHotel, IRoom } from '@/utils/interface';
import { urlImagesRooms, urlImagesRoomsLove } from '@/utils/images';
import { useAppDispatch } from '@/app/store';
import { fetchUpdateDeleteHotel } from '@/reducer/hotel/hotel.slice';

const isUrl = z.string().url();
function CardDetailHotel({
  targetHotel,
  index,
  setIsOpenModalFormHotel,
}: {
  targetHotel: IHotel<IRoom[]>;
  index: number;
  setIsOpenModalFormHotel: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const disableHotel = targetHotel?.isDelete;

  const imagesHotel = React.useMemo<string[]>(() => {
    if (typeof targetHotel?.images === 'object' && !Number.isNaN(index)) {
      return isUrl.safeParse(targetHotel?.images[0]).success
        ? (targetHotel.images as [])
        : [urlImagesRooms[index], ...urlImagesRoomsLove, ...urlImagesRooms];
    }
    return [urlImagesRooms[index], ...urlImagesRoomsLove, ...urlImagesRooms];
  }, [targetHotel, index]);

  return (
    <>
      <Card sx={{ width: '70vw', border: '1px solid black', position: 'relative' }}>
        <Stack flexDirection='row'>
          <Box sx={{ width: 400 }}>
            <ImageList
              variant='quilted'
              cols={4}
              rowHeight='auto'
              sx={{ m: 0, width: 400 }}
            >
              {imagesHotel.slice(0, 4).map((item, i) => (
                <ImageListItem
                  sx={{
                    cursor: 'pointer',
                  }}
                  key={i}
                  cols={i === 0 ? 4 : 1}
                  rows={i === 0 ? 4 : 1}
                >
                  <img src={item} alt={targetHotel?.hotelName} loading='lazy' />
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
                >
                  <img src={imagesHotel[4]} alt={targetHotel?.hotelName} loading='lazy' />
                </ImageListItem>
              )}
            </ImageList>
          </Box>
          <CardContent>
            <Typography>Name :{targetHotel?.hotelName}</Typography>
            <Typography>Address :{targetHotel?.address}</Typography>
            <Typography>City :{targetHotel?.city}</Typography>
            <Typography>Country :{targetHotel?.country}</Typography>
            <Typography>PropertyType:{targetHotel?.propertyType}</Typography>
            <Typography>ZipCode :{targetHotel?.zipCode}</Typography>
            <Typography>Latitude: {targetHotel?.latitude}</Typography>
            <Typography>Longitude :{targetHotel?.longitude}</Typography>
            <Typography>Star:{targetHotel?.star}</Typography>
            <Typography>Star rating:{targetHotel?.starRating.starAverage}</Typography>
            <Typography>Count Review:{targetHotel?.starRating.countReview}</Typography>
            <Typography>Count Room:{targetHotel?.roomTypeIds.length}</Typography>
          </CardContent>
        </Stack>
        <Box sx={{ position: 'absolute', bottom: 4, right: 5 }}>
          <Button disabled={disableHotel} onClick={() => setIsOpenModalFormHotel(true)}>
            Edit
          </Button>
        </Box>
        <IconClose
          onClick={() =>
            dispatch(
              fetchUpdateDeleteHotel({
                index,
                isDelete: true,
                id: targetHotel?._id as string,
              })
            )
          }
          fontSize='small'
        />
      </Card>
    </>
  );
}

export default CardDetailHotel;
