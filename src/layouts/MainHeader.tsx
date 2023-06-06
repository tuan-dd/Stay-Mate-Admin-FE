import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { shallowEqual, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import Logo from '../components/Logo';
import { RootState, useAppDispatch } from '@/app/store';
import { fetchSignOut } from '@/reducer/auth/auth.slice';
import { fetchGetMembership } from '@/reducer/membership/membership.slice';
import ModalPaymentMembership from '@/components/modal/ModalPaymentMembership';
import { ERole } from '@/utils/enum';

const pages = ['Support', 'Contact', null] as const;
type Pages = (typeof pages)[number];

function MainHeader() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [isOpenModalPaymentMembership, setIsOpenModalPaymentMembership] =
    React.useState<boolean>(false);

  const { currentUser, role } = useSelector(
    (state: RootState) => ({
      currentUser: state.user.currentUser,
      role: state.user.role,
    }),
    shallowEqual
  );
  const is2FA = useSelector((state: RootState) => state.auth.is2FA, shallowEqual);

  const { memberships, isExpire } = useSelector(
    (state: RootState) => ({
      memberships: state.membership.memberships,
      isExpire: state.membership.isExpire,
    }),
    shallowEqual
  );

  const dispatch = useAppDispatch();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (page: Pages) => {
    if (!page) setAnchorElNav(null);

    setAnchorElNav(null);
    // return navigate(`${page.toLowerCase()}`);
  };

  React.useEffect(() => {
    if (role === ERole.HOTELIER && !memberships.length) {
      dispatch(fetchGetMembership({ isExpire: false, page: 1 }));
    }
  }, [role]);

  const remainMemberShip = React.useMemo<null | number>(() => {
    if (memberships.length > 0 && !memberships[0].isExpire) {
      return Number(dayjs(memberships[0].timeEnd).diff(dayjs(), 'days'));
    }
    return null;
  }, [memberships, isExpire]);

  return (
    <AppBar sx={{ position: 'absolute', bgcolor: 'background.defaultChannel' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          {/* mobile */}
          <Logo sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

          <Typography
            variant='h5'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'UseUrban',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#e76993',
              textDecoration: 'none',
            }}
          >
            Stay Mate
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu(null)}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                  <Typography textAlign='center'>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Logo sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant='h5'
            noWrap
            component='a'
            href=''
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              color: '#e76993',
              flexGrow: 1,
              fontFamily: 'UseUrban',
              fontWeight: 700,
              letterSpacing: '.3rem',
              textDecoration: 'none',
            }}
          >
            Stay Mate
          </Typography>

          {/* box Menu and card */}
          <Stack sx={{ flexGrow: 0 }} flexDirection='row' gap={3} alignItems='center'>
            {remainMemberShip ? (
              <Stack flexDirection='row' alignItems='center'>
                <Typography>
                  Your membership remains:{' '}
                  {remainMemberShip === 1
                    ? `${remainMemberShip} day`
                    : `${remainMemberShip} days`}
                </Typography>
              </Stack>
            ) : (
              <Button
                sx={{ color: 'white' }}
                onClick={() => setIsOpenModalPaymentMembership(true)}
              >
                Upgrade membership
              </Button>
            )}
            <IconButton sx={{ p: 0 }}>
              <Avatar alt={currentUser?.name} src={currentUser?.avatar} />
            </IconButton>
            <Typography fontWeight={700} color='black'>
              {Math.round(
                ((currentUser?.account.balance as number) + Number.EPSILON) * 100
              ) / 100 || 0}{' '}
              $
            </Typography>

            <Typography fontWeight={700} color='black'>
              {Math.round(
                ((currentUser?.account.virtualBalance as number) + Number.EPSILON) * 100
              ) / 100 || 0}{' '}
              $
            </Typography>
            {is2FA && (
              <Button
                color='warning'
                sx={{ fontWeight: 700 }}
                onClick={() => dispatch(fetchSignOut())}
              >
                Log out
              </Button>
            )}
          </Stack>
        </Toolbar>
      </Container>
      <ModalPaymentMembership
        isOpenModal={isOpenModalPaymentMembership}
        setIsOpenModal={setIsOpenModalPaymentMembership}
      />
    </AppBar>
  );
}
export default MainHeader;
