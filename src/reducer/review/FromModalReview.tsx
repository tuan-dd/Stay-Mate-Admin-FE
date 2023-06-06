import React from 'react';
import { Stack, Box } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FTextField, FormProvider } from '@components/formProvider';
import BasicModal from '@components/modal/BasicModal';
import { IReview } from '@utils/interface';

interface IDefaultValues {
  context: string;
}

const checkInput = z.object({
  context: z.string().min(1),
});

function FromModalReview({
  review,
  isOpenModal,
  setIsOpenModal,
  handelSubmit,
  pending,
}: {
  review: IReview | undefined;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  handelSubmit: (data: string) => void;
  pending: boolean;
}) {
  const defaultValues: IDefaultValues = {
    context: review?.context || '',
  };

  const methods = useForm<IDefaultValues>({
    defaultValues,
    resolver: zodResolver(checkInput),
  });

  const { reset } = methods;

  const onSubmit: SubmitHandler<IDefaultValues> = (data) => {
    handelSubmit(data.context);
  };

  React.useEffect(() => {
    reset(defaultValues);
  }, [review]);

  return (
    <BasicModal
      open={isOpenModal}
      setOpen={setIsOpenModal}
      sx={{ p: 0, width: 900, maxHeight: 700 }}
      disableGutters
    >
      <Box ml={1} p={2}>
        <FormProvider onSubmit={onSubmit} {...methods}>
          <Stack spacing={2} pt={2}>
            <FTextField name='context' label='Context' focused />
            <LoadingButton type='submit' loading={pending}>
              Submit
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Box>
    </BasicModal>
  );
}

export default FromModalReview;
