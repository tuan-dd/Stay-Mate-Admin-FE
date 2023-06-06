import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import BasicModal from './BasicModal';

// TODO rename
function ModalImages({
  isOpenModal,
  setIsOpenModal,
  amenities,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  amenities: {
    name: string;
    url: string | boolean;
  }[];
}) {
  return (
    <BasicModal
      open={isOpenModal}
      setOpen={setIsOpenModal}
      disableGutters
      sx={{
        height: 'auto',
        width: 'auto',
        p: 2,
        left: '60%',
        borderRadius: 10,
        border: 'solid 0.5px',
      }}
    >
      <Grid container spacing={4}>
        {amenities.map((e) => (
          <Grid key={e.name} item xs={3} borderRadius={10}>
            <Box sx={{ flex: '1 0 auto' }}>
              {e.url ? (
                <img src={e.url as string} alt={e.name} width='30px' height='30px' />
              ) : (
                <CheckIcon
                  sx={{
                    bgcolor: 'white',
                    color: 'secondary.main',
                    width: '30px',
                    height: '30px',
                  }}
                />
              )}
              &nbsp;
              <Typography
                sx={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  '&:hover': {
                    overflow: 'visible',
                    zIndex: 500,
                  },
                }}
              >
                {e.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </BasicModal>
  );
}

export default ModalImages;
