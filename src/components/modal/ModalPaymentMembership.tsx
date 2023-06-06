import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { LoadingButton } from '@mui/lab';
import BasicModal from './BasicModal';
import { FRadioGroup, FTextField, FormProvider } from '../formProvider';
import { EPackage, EPricePackage, EStatusRedux } from '@/utils/enum';
import { RootState, useAppDispatch } from '@/app/store';
import { fetchPaymentMembership } from '@/reducer/membership/membership.slice';

export interface IPaymentMemberShip {
  package: EPackage;
  password: string;
}

const packages = ['WEEK', 'MONTH', 'YEAR'] as const;

function ModalPaymentMembership({
  isOpenModal,
  setIsOpenModal,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isShowPw, setIsShowPw] = React.useState<boolean>(false);
  const balance = useSelector(
    (state: RootState) => state.user.currentUser?.account.balance
  );
  const { statePayment, errorMessage } = useSelector((state: RootState) => ({
    statePayment: state.membership.status,
    errorMessage: state.membership.errorPaymentMemberShip,
  }));
  const dispatch = useAppDispatch();

  const paymentMemberShipSchema = z.object({
    package: z
      .enum(packages)
      .refine(
        (date) => (EPricePackage[date] as number) < (balance as number),
        'Balance not is enough to buy memberShip, charge money'
      ),
    password: z.string().min(1, 'Password not empty'),
  });

  const defaultValues: IPaymentMemberShip = {
    package: EPackage.YEAR,
    password: 'Tuanngungoc12',
  };

  const methods = useForm<IPaymentMemberShip>({
    defaultValues,
    resolver: zodResolver(paymentMemberShipSchema),
  });

  const { watch } = methods;

  const packageWatch = watch().package;
  const onSubmit: SubmitHandler<IPaymentMemberShip> = (data) => {
    dispatch(
      fetchPaymentMembership({ packageHotel: data.package, password: data.password })
    );
  };

  return (
    <BasicModal open={isOpenModal} setOpen={setIsOpenModal}>
      <FormProvider onSubmit={onSubmit} {...methods}>
        {errorMessage && <Alert severity='error'> {errorMessage}</Alert>}
        <Stack spacing={2} mt={2}>
          <FRadioGroup
            name='package'
            options={[...packages]}
            getOptionLabel={[...packages]}
          />
          <Typography color='blue' textAlign='center'>
            Package {packageWatch} price: {EPricePackage[packageWatch]} $
          </Typography>
          <FTextField
            name='password'
            focused
            label='Password'
            type={isShowPw ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={() => setIsShowPw((e) => !e)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge='end'
                  >
                    {isShowPw ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton type='submit' loading={statePayment === EStatusRedux.pending}>
            Submit
          </LoadingButton>
        </Stack>
      </FormProvider>
    </BasicModal>
  );
}

export default ModalPaymentMembership;
