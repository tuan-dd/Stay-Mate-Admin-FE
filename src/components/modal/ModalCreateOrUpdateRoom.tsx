import React from 'react';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box, Stack } from '@mui/material';

import { FMultiCheckbox, FTextField, FUploadImages, FormProvider } from '../formProvider';
import { roomAmenities } from '@/utils/enum';
import { ICreateRoom } from './ModalCreateOrUpdateHotel';
import BasicModal from './BasicModal';
import { IRoom } from '@/utils/interface';
import IconClose from '../IconClose';
import { cloudinaryUploads } from '@/utils/cloudinary';

const createRoom = z.object({
  roomAmenities: z.array(z.enum(roomAmenities)).min(1),
  nameOfRoom: z.string().min(1),
  rateDescription: z.string().min(1),
  price: z.number().min(1),
  mealType: z.string().optional(),
  images: z.array(z.any()).min(1, 'Must contain at least 1 image'),
  numberOfRoom: z.number().min(1).int(),
});

const styleBox = {
  position: 'relative',
  overflowX: 'hidden',
  height: '100%',
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

function ModalCreateOrUpdateRoom({
  isOpenModal,
  setIsOpenModal,
  handelSubmit,
  room,
  pending = false,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  handelSubmit: (data: ICreateRoom) => void;
  room: IRoom | ICreateRoom | undefined;
  pending?: boolean;
}) {
  const defaultValues: ICreateRoom = {
    nameOfRoom: room?.nameOfRoom || '',
    numberOfRoom: room?.numberOfRoom || 0,
    price: room?.price || 0,
    rateDescription: room?.rateDescription || '',
    mealType: room?.mealType || '',
    roomAmenities: room?.roomAmenities || [],
    images: room?.images || [],
  };

  const methods = useForm<ICreateRoom>({
    defaultValues: { ...defaultValues },
    resolver: zodResolver(createRoom),
  });
  const { watch, setValue, reset } = methods;

  const onSubmit: SubmitHandler<ICreateRoom> = (data) => {
    handelSubmit(data);
  };

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

  React.useEffect(() => {
    reset(defaultValues);
  }, [isOpenModal]);

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
        sx={{ right: 10 }}
      />
      <Box sx={{ ...styleBox }}>
        <FormProvider {...methods} onSubmit={onSubmit}>
          <Stack spacing={2}>
            <FTextField name='nameOfRoom' label='Name of room' />
            <FTextField name='numberOfRoom' label='Number of room' typeInput='number' />
            <FTextField name='price' label='Price' typeInput='number' />
            <FTextField name='rateDescription' label='Rate Description' />
            <FTextField name='mealType' label='Meal Type' />
            <Box sx={{ ...styleBox, maxHeight: 300 }}>
              <FMultiCheckbox options={[...roomAmenities]} name='roomAmenities' />
            </Box>
            <FUploadImages
              name='images'
              accept={{
                'image/*': ['.jpeg', '.jpg', '.png'],
              }}
              maxSize={5145728}
              onDrop={handleDrop}
            />
            <LoadingButton loading={pending} type='submit'>
              Submit
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Box>
    </BasicModal>
  );
}

export default ModalCreateOrUpdateRoom;
