/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box, Stack } from '@mui/material';
import IconClose from '@components/IconClose';
import { IHotel, IRoom } from '@utils/interface';
import { FTextField, FUploadImages, FormProvider } from '../formProvider';
import BasicModal from './BasicModal';
import ModalCreateOrUpdateRoom from './ModalCreateOrUpdateRoom';
import { cloudinaryUploads } from '@/utils/cloudinary';
import GridCardRoom from '../GridCardRoom';

export interface ICreateRoom {
  roomAmenities: string[];
  nameOfRoom: string;
  rateDescription: string;
  mealType?: string;
  images: any[];
  price: number;
  numberOfRoom: number;
}

export interface ICreateHotel {
  hotelName: string;
  images: any[];
  address: string;
  city: string;
  country: string;
  propertyType: string;
  zipCode?: number;
  latitude: number;
  longitude: number;
  star: number;
  roomTypes: ICreateRoom[];
}

const createHotelSchema = z.object({
  hotelName: z.string().min(1),
  images: z.array(z.any()).min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  propertyType: z.string().min(1),
  zipCode: z.number().int().min(999).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  star: z.number().min(0.5).max(5),
  roomTypes: z.array(z.any()).min(1, 'Must contain at least 1 image'),
});

const styleBox = {
  overflowX: 'hidden',
  height: '100%',
  ZIndex: 5,
  p: 1,
  '::-webkit-scrollbar': { width: 12, bgcolor: 'transparent' },
  '::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,.3)',
    bgcolor: 'primary.main',
  },
  '::-webkit-scrollbar-track': {
    borderRadius: '10px',
    WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,.3)',
    bgcolor: '#F5F5F5',
  },
};

const settings = ['edit', 'delete', null];
function ModalCreateOrUpdateHotel({
  isOpenModal,
  setIsOpenModal,
  hotel,
  handelSubmit,
  pending = false,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  hotel: IHotel<IRoom[]> | undefined;
  handelSubmit: (data: ICreateHotel) => void;
  pending?: boolean;
}) {
  const defaultValues: ICreateHotel = {
    hotelName: hotel?.hotelName || 'Mường Thanh',
    address: hotel?.address || '21 stress 22',
    city: hotel?.city || 'Vung Tau',
    country: hotel?.country || 'Viet Nam',
    propertyType: hotel?.propertyType || 'Hotel',
    zipCode: hotel?.zipCode || 60000,
    latitude: hotel?.latitude || 10.406,
    longitude: hotel?.longitude || 106.118,
    star: hotel?.star || 3.5,
    images: hotel?.images || [],
    roomTypes:
      hotel?.roomTypeIds.map((room) => ({
        roomAmenities: room.roomAmenities,
        nameOfRoom: room.nameOfRoom,
        rateDescription: room.rateDescription,
        price: room.price,
        mealType: room?.mealType || '',
        images: room.images || [],
        numberOfRoom: room.numberOfRoom,
      })) || [],
  };

  const [isOpenModalFormRoom, setIsOpenModalFormRoom] = React.useState<boolean>(false);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const refRoom = React.useRef<undefined | ICreateRoom>(undefined);

  const methods = useForm<ICreateHotel>({
    defaultValues,
    resolver: zodResolver(createHotelSchema),
  });
  const { setValue, watch, reset } = methods;

  const newHotel = watch();

  const refRooms = React.useRef<ICreateRoom[]>([]);

  if (newHotel.roomTypes.length !== refRooms.current.length) {
    refRooms.current = newHotel.roomTypes;
  }

  const handleDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles) {
        const files = acceptedFiles;
        const urlFiles = await cloudinaryUploads(
          files.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
        const imagesWatch = watch();
        if (typeof urlFiles === 'object') {
          setValue('images', [...imagesWatch.images, ...urlFiles]);
        }
      }
    },
    [setValue]
  );

  const onSubmit: SubmitHandler<ICreateHotel> = (data) => {
    handelSubmit(data);
  };

  const handelOpenModal = (index: null | number) => {
    if (!index) {
      refRoom.current = undefined;
      setIsOpenModalFormRoom(true);
    }
  };

  const handelAddRoom = (data: ICreateRoom) => {
    if (!refRoom.current) {
      setValue('roomTypes', [...newHotel.roomTypes, data], { shouldValidate: true });
    } else {
      const indexPreRoom = newHotel.roomTypes.findIndex(
        (room) => room.nameOfRoom === refRoom.current?.nameOfRoom
      );
      if (indexPreRoom > -1) {
        const newRoomTypes = [...newHotel.roomTypes];
        newRoomTypes[indexPreRoom] = data;
        setValue('roomTypes', newRoomTypes, { shouldValidate: true });
      }
    }
    setIsOpenModalFormRoom(false);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  React.useEffect(() => {
    reset(defaultValues);
  }, [isOpenModal]);

  const handleCloseNavMenu = (setting: string | null, index: number) => {
    if (!settings) {
      setAnchorElNav(null);
    } else if (setting === 'edit') {
      refRoom.current = newHotel.roomTypes[index];
      setIsOpenModalFormRoom(true);
    } else {
      const newRooms = [...newHotel.roomTypes.splice(index, 1)];
      setValue('roomTypes', newRooms);
    }
    setAnchorElNav(null);
  };
  return (
    <BasicModal
      open={isOpenModal}
      setOpen={setIsOpenModal}
      maxWidth={false}
      sx={{ width: '95vw', height: '90vh', borderRadius: 5, p: 3, pt: 7 }}
    >
      <IconClose
        onClick={() => setIsOpenModal(false)}
        fontSize='small'
        sx={{ right: 10, top: 10 }}
      />
      <Box sx={styleBox}>
        <FormProvider onSubmit={onSubmit} {...methods}>
          <Stack spacing={2}>
            <FTextField name='hotelName' label='Hotel Name' />
            <FTextField name='address' label='Address' />
            <FTextField name='city' label='City' />
            <FTextField name='country' label='Country' />
            <FTextField name='propertyType' label='Property Type' />
            <FTextField name='zipCode' label='zipCode' typeInput='number' />
            <FTextField
              name='latitude'
              label='Latitude'
              typeInput='number'
              inputProps={{ step: 0.001 }}
            />
            <FTextField
              name='longitude'
              label='Longitude'
              typeInput='number'
              inputProps={{ step: 0.001 }}
            />
            <FTextField
              name='star'
              label='star'
              typeInput='number'
              min={0.5}
              max={5}
              inputProps={{ step: 0.5 }}
            />
            <FUploadImages
              name='images'
              accept={{
                'image/*': ['.jpeg', '.jpg', '.png'],
              }}
              maxSize={5145728}
              onDrop={handleDrop}
            />
            {hotel === undefined && (
              <GridCardRoom
                rooms={refRooms.current}
                handelOpenModal={handelOpenModal}
                anchorElNav={anchorElNav}
                handleCloseNavMenu={handleCloseNavMenu}
                handleOpenNavMenu={handleOpenNavMenu}
              />
            )}
            <LoadingButton loading={pending} type='submit'>
              Submit
            </LoadingButton>
          </Stack>
        </FormProvider>
        <ModalCreateOrUpdateRoom
          key={refRoom?.current?.nameOfRoom || 'undefined'}
          isOpenModal={isOpenModalFormRoom}
          setIsOpenModal={setIsOpenModalFormRoom}
          room={refRoom?.current}
          handelSubmit={handelAddRoom}
        />
      </Box>
    </BasicModal>
  );
}

export default ModalCreateOrUpdateHotel;
