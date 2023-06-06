/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { Container } from '@mui/system';
import { RootState, useAppDispatch } from '@app/store';
import { ERole, EStatusRedux } from '@utils/enum';
import { throttle } from '@utils/utils';
import ModalPaymentMembership from '@components/modal/ModalPaymentMembership';
import { fetchGetMembership } from './membership.slice';
import CardMemberShip from './CardMemberShip';

function MemberShip() {
  const [typeMemberShip, setTypeMemberShip] = React.useState<string>('unExpired');
  const [page, setPage] = React.useState<number>(1);
  const [isOpenModalPaymentMembership, setIsOpenModalPaymentMembership] =
    React.useState<boolean>(false);
  const { memberships, errorMessage, isExpire, status } = useSelector(
    (state: RootState) => state.membership
  );
  const role = useSelector((state: RootState) => state.user.role);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const checkTypeMemberShip = typeMemberShip !== 'unExpired';
    if (role === ERole.HOTELIER && checkTypeMemberShip !== isExpire) {
      typeMemberShip === 'unExpired'
        ? dispatch(fetchGetMembership({ isExpire: false, page: 1 }))
        : dispatch(fetchGetMembership({ isExpire: true, page: 1 }));
      setPage(1);
    }
  }, [role, typeMemberShip]);

  const fetchPage = () => {
    if (errorMessage || !memberships.length || status === EStatusRedux.pending)
      return window.removeEventListener('scroll', tHandler);

    setPage(page + 1);
    return typeMemberShip === 'unExpired'
      ? dispatch(fetchGetMembership({ isExpire: false, page: page + 1 }))
      : dispatch(fetchGetMembership({ isExpire: true, page: page + 1 }));
  };

  const onScroll = () => {
    const heightScroll = window.scrollY + window.innerHeight;

    if (heightScroll > (document.documentElement.scrollHeight * 18) / 20) fetchPage();
  };

  const tHandler = throttle(onScroll, 400);

  React.useEffect(() => {
    if (!errorMessage.length || page === 1) {
      window.addEventListener('scroll', tHandler);
    }
    return () => window.removeEventListener('scroll', tHandler);
  }, [errorMessage, page, memberships]);

  return (
    <Container maxWidth='md'>
      <Stack flexDirection='row' columnGap={3} marginTop={5} minHeight='60vh'>
        <FormControl>
          <RadioGroup
            value={typeMemberShip}
            onChange={(_event, value) => setTypeMemberShip(value)}
          >
            <FormControlLabel value='unExpired' control={<Radio />} label='UnExpired' />
            <FormControlLabel value='expired' control={<Radio />} label='Expired' />
          </RadioGroup>
        </FormControl>
        <Stack spacing={2}>
          {memberships.length ? (
            memberships.map((membership, i) => (
              <Box mt={2} key={i}>
                <CardMemberShip membership={membership} />
              </Box>
            ))
          ) : (
            <Box>
              <Typography>No membership</Typography>
            </Box>
          )}
          <Button
            variant='contained'
            onClick={() => setIsOpenModalPaymentMembership(true)}
          >
            Upgrade extra memberShip
          </Button>
        </Stack>
      </Stack>
      <ModalPaymentMembership
        isOpenModal={isOpenModalPaymentMembership}
        setIsOpenModal={setIsOpenModalPaymentMembership}
      />
    </Container>
  );
}

export default MemberShip;
