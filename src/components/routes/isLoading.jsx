import { useContext } from 'react';
import LoadingScreen from '../components/loadingScreen';
import { VideoContext } from '../contexts/dataMoviesProvider';

function IsLoading({ children }) {
   const { isLoading } = useContext(VideoContext);
   if (isLoading) {
      return <LoadingScreen />;
   }
   return children;
}

export default IsLoading;
