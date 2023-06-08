import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import React from 'react';
import Cookies from 'js-cookie';
import { RootState, useAppDispatch } from '@/app/store';
import { decoded, setAllCookie } from '@/utils/jwt';
import { fetchUser } from '@/reducer/user/user.slice';
import { fetchNewAccessToken, setIsInitialState } from '@/reducer/auth/auth.slice';
import LoadingScreen from '@/components/LoadingScreen';

function AuthRequire({ children }: { children: React.ReactNode | React.ReactNode[] }) {
  const { is2FA, isInitialState } = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.user.currentUser);
  const location = useLocation();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    try {
      const accessToken = decoded(Cookies.get('accessToken'));
      const refreshToken = decoded(Cookies.get('refreshToken'));
      if (accessToken && !user) {
        dispatch(fetchUser());
      } else if (refreshToken && !accessToken) {
        dispatch(fetchNewAccessToken());
      } else if (!refreshToken && !accessToken) {
        dispatch(setIsInitialState());
        setAllCookie(true);
      }
    } catch (error) {
      setAllCookie(true);
      dispatch(setIsInitialState());
    }
  }, []);

  if (!isInitialState) {
    return <LoadingScreen />;
  }
  if (!is2FA) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  return <div>{children}</div>;
}

export default AuthRequire;
