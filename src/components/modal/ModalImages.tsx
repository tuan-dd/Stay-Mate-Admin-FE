import React from 'react';
import Card from '@mui/material/Card';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { IconButton } from '@mui/material';
import IconClose from '@components/IconClose';
import BasicModal from './BasicModal';

const styleButton = {
  position: 'absolute',
  zIndex: 15,
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  top: '45%',
  right: '0',
  opacity: 0.5,
  ':hover': {
    opacity: 1,
  },
};

function ModalImages({
  isOpenModal,
  setIsOpenModal,
  images,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  images: string[];
}) {
  const [index, setIndex] = React.useState<number>(0);

  return (
    <BasicModal
      open={isOpenModal}
      setOpen={setIsOpenModal}
      disableGutters
      sx={{ height: 600, width: 700, p: 0 }}
    >
      <IconClose onClick={() => setIsOpenModal(false)} />
      <IconButton
        sx={{ ...styleButton, right: '92%' }}
        onClick={() => setIndex((e) => (e === 0 ? images.length - 1 : e - 1))}
      >
        <ArrowBackIosIcon sx={{ fontSize: 35 }} color='primary' />
      </IconButton>
      <Card
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <img
          src={images[index]}
          srcSet={images[index]}
          loading='lazy'
          alt='hotel'
          width='100%'
          height='100%'
        />
      </Card>
      <IconButton
        sx={{ ...styleButton }}
        onClick={() => setIndex((e) => (e === images.length - 1 ? 0 : e + 1))}
      >
        <ArrowForwardIosIcon sx={{ fontSize: 35 }} color='primary' />
      </IconButton>
    </BasicModal>
  );
}

export default ModalImages;
