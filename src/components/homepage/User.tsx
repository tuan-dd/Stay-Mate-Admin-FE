import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import {
  Card,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Alert,
  Button,
  Chip,
  Box,
} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { IUpdateUser, fetchUpdateUser } from '@reducer/user/user.slice';
import { fetchCharge, fetchWithdraw } from '@reducer/payment/payment.slice';
import { RootState, useAppDispatch } from '@/app/store';
import { FTextField, FUploadAvatar, FormProvider } from '@/components/formProvider';
import { EStatusRedux } from '@/utils/enum';
import { cloudinaryUpload } from '@/utils/cloudinary';

const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
const hintMoneyCharge = [100, 500, 1000, 5000];
const validDefaultValues = z
  .object({
    avatar: z.any(),
    name: z.string().min(2),
    password: z.string().optional(),
    newPassword: z
      .string()
      .optional()
      .refine((data) => {
        if (typeof data === 'string' && data.length) {
          return regex.test(data);
        }
        return true;
      }, 'Password contain at least one numeric digit, one uppercase and one lowercase letter,min 6 max 20'),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword)
        return data.newPassword === data.confirmPassword && data.password;
      return true;
    },
    {
      message: "New password don't match or password not empty ",
      path: ['confirmPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword) return data.newPassword !== data.password;
      return true;
    },
    {
      message: 'Password not same new password ',
      path: ['password'],
    }
  );

function User() {
  const [labelInput, setLabelInput] = React.useState<string>('Charge');
  const [alertChargeOrWithdraw, setAlertChargeOrWithdraw] = React.useState<string>('');
  const [isShowPw, setIsShowPw] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [isShowPwWithdraw, setIsShowPwWithdraw] = React.useState<boolean>(false);

  const { currentUser, status } = useSelector(
    (state: RootState) => state.user,
    shallowEqual
  );
  const { errorMessageChargeOrWithdraw, statusPayment } = useSelector(
    (state: RootState) => ({
      errorMessageChargeOrWithdraw: state.payment.errorMessageChargeOrWithdraw,
      statusPayment: state.payment.status,
    }),
    shallowEqual
  );
  const defaultValues: IUpdateUser = {
    avatar: currentUser?.avatar || '',
    name: currentUser?.name || '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  };
  const methods = useForm<IUpdateUser>({
    defaultValues,
    resolver: zodResolver(validDefaultValues),
  });

  const { setValue, reset } = methods;

  const onSubmit: SubmitHandler<IUpdateUser> = (data) => {
    if (data.password) {
      dispatch(fetchUpdateUser({ ...data }));
    } else {
      dispatch(fetchUpdateUser({ avatar: data.avatar, name: data.name }));
    }
  };

  React.useEffect(() => {
    reset(defaultValues);
  }, [currentUser]);

  const handleDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles) {
        const file = acceptedFiles[0];
        const urlFile = await cloudinaryUpload(
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        if (urlFile) {
          setValue('avatar', urlFile);
        }
      }
    },
    [setValue]
  );

  const handelChange = (value: string) => {
    setLabelInput(value);
  };

  const refInputChargeOrWithdraw = React.useRef<HTMLInputElement>(null);
  const refInputPasswordWithdraw = React.useRef<HTMLInputElement>(null);

  const onSubmitChargeOrWithdraw = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (refInputChargeOrWithdraw.current?.value) {
      if (labelInput === 'Withdraw' && refInputPasswordWithdraw.current?.value) {
        setAlertChargeOrWithdraw('');
        dispatch(
          fetchWithdraw({
            password: refInputPasswordWithdraw.current.value,
            withdraw: parseInt(refInputChargeOrWithdraw.current?.value, 10),
          })
        );
      } else if (labelInput === 'Charge') {
        setAlertChargeOrWithdraw('');
        dispatch(fetchCharge(parseInt(refInputChargeOrWithdraw.current?.value, 10)));
      } else {
        setAlertChargeOrWithdraw('Password and input balance not empty not empty ');
      }
    } else {
      setAlertChargeOrWithdraw('Password and input balance not empty not empty ');
    }
  };

  React.useEffect(() => {
    if (errorMessageChargeOrWithdraw)
      setAlertChargeOrWithdraw(errorMessageChargeOrWithdraw);
  }, [errorMessageChargeOrWithdraw]);

  const hintMoneyWithdraw = React.useMemo<number[]>(() => {
    if (currentUser?.account.balance) {
      if (currentUser?.account.balance < 999) {
        return [Math.round(currentUser.account.balance)];
      }
      return [100, 500, Math.round(currentUser.account.balance)];
    }
    return [];
  }, [currentUser?.account.balance]);

  return (
    <>
      <Box maxWidth='70%' marginX='auto' mb={1}>
        <FormProvider {...methods} onSubmit={onSubmit}>
          <Stack mt={2} flexDirection='row' sx={{ with: 900, height: '100%' }}>
            <Card
              sx={{
                py: 10,
                px: 3,
                textAlign: 'center',
                borderRight: 'none',
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              <FUploadAvatar
                name='avatar'
                accept={{
                  'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
                }}
                maxSize={4145728}
                onDrop={handleDrop}
              />
              <Typography
                variant='caption'
                sx={{
                  mt: 2,
                  display: 'block',
                }}
              >
                Allowed *.jpeg, *.jpg, *.png, *.gif max size of 4 MB
              </Typography>
            </Card>
            <Card
              sx={{
                textAlign: 'center',
                p: 4,
                flexGrow: 1,
                borderLeft: 'none',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              <Stack spacing={3}>
                <FTextField name='name' label='Name' focused />
                <FTextField
                  type={isShowPw ? 'text' : 'password'}
                  name='password'
                  label='Password'
                  focused
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
                <FTextField
                  type={isShowPw ? 'text' : 'password'}
                  name='newPassword'
                  label='New Password'
                  focused
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
                <FTextField
                  type={isShowPw ? 'text' : 'password'}
                  name='confirmPassword'
                  label='Confirm Password'
                  focused
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
                <TextField
                  key={currentUser?.role}
                  name='role'
                  label='Role'
                  defaultValue={currentUser?.role}
                  focused
                  disabled
                  autoComplete='true'
                />
                <TextField
                  key={currentUser?.account.balance}
                  name='account'
                  label='Account'
                  defaultValue={currentUser?.account.balance}
                  focused
                  disabled
                />
              </Stack>
              <Stack alignItems='center' sx={{ mt: 3 }}>
                <LoadingButton
                  type='submit'
                  variant='contained'
                  loading={status === EStatusRedux.pending}
                >
                  Save Changes
                </LoadingButton>
              </Stack>
            </Card>
          </Stack>
        </FormProvider>
        <Card sx={{ mt: 1, padding: 2 }}>
          <Stack flexDirection='row' columnGap={3}>
            {labelInput === 'Withdraw'
              ? hintMoneyWithdraw.map((value) => (
                  <Button
                    onClick={() => {
                      (document.querySelector('#Withdraw') as HTMLInputElement).value =
                        value.toString();
                    }}
                    key={value}
                  >
                    <Chip label={`${value}$`} />
                  </Button>
                ))
              : hintMoneyCharge.map((value) => (
                  <Button
                    onClick={() => {
                      (document.querySelector('#Charge') as HTMLInputElement).value =
                        value.toString();
                    }}
                    key={value}
                  >
                    <Chip label={`${value}$`} />
                  </Button>
                ))}
          </Stack>
          <form onSubmit={onSubmitChargeOrWithdraw}>
            <Stack flexDirection='row' columnGap={2} alignItems='center'>
              <TextField
                inputRef={refInputChargeOrWithdraw}
                id={labelInput}
                label={`${labelInput} balance`}
                inputProps={{
                  min: 1,
                  max: labelInput === 'Withdraw' ? currentUser?.account.balance : null,
                  step: 1,
                }}
                type='number'
                fullWidth
                focused
              />
              {labelInput === 'Withdraw' && (
                <TextField
                  inputRef={refInputPasswordWithdraw}
                  autoComplete='true'
                  type={isShowPwWithdraw ? 'text' : 'password'}
                  defaultValue='Tuan310797'
                  name='passwordCharge'
                  label='password'
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={() => setIsShowPwWithdraw((e) => !e)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge='end'
                        >
                          {isShowPwWithdraw ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  focused
                />
              )}
              <RadioGroup
                value={labelInput}
                onChange={(_event, value) => handelChange(value)}
              >
                <FormControlLabel control={<Radio />} label='Charge' value='Charge' />
                <FormControlLabel control={<Radio />} label='Withdraw' value='Withdraw' />
              </RadioGroup>
              <LoadingButton
                type='submit'
                variant='contained'
                loading={statusPayment === EStatusRedux.pending}
                sx={{ fontSize: 10 }}
              >
                Confirm
              </LoadingButton>
            </Stack>
          </form>

          {alertChargeOrWithdraw && (
            <Alert sx={{ bgcolor: 'transparent', pl: 30 }} severity='error'>
              {alertChargeOrWithdraw}
            </Alert>
          )}
        </Card>
      </Box>
    </>
  );
}

export default User;
