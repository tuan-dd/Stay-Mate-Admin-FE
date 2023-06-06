import React from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import NotFoundPage from '@pages/NotFoundPage';
import { googleMapsApiKey } from '@/app/config';
import BasicModal from './BasicModal';

const containerStyle = {
  width: '100%',
  height: '100%',
};

function ModalMap({
  isOpenModal,
  setIsOpenModal,
  lat,
  lng,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  lat: number;
  lng: number;
}) {
  const { isLoaded } = useLoadScript({ googleMapsApiKey });

  const center = React.useMemo(() => ({ lat, lng }), []);

  if (!isLoaded) return <NotFoundPage />;
  return (
    <BasicModal
      open={isOpenModal}
      setOpen={setIsOpenModal}
      sx={{ height: '80vh', width: '90%', background: 'white', p: 0 }}
    >
      <GoogleMap zoom={15} center={center} mapContainerStyle={containerStyle}>
        <MarkerF position={center} />
      </GoogleMap>
    </BasicModal>
  );
}

export default ModalMap;
