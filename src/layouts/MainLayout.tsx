import { Outlet } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import AlertMsg from '@components/AlertMsg';
import NavigationListener from '@components/NavigationListener';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';

function MainLayout() {
  return (
    <Stack position='relative'>
      <MainHeader />
      <NavigationListener />
      <AlertMsg />
      <Outlet />
      <MainFooter />
    </Stack>
  );
}

export default MainLayout;
