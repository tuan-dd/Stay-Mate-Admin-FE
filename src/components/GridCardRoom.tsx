import {
  Box,
  Grid,
  Stack,
  Typography,
  Button,
  Card,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ICreateRoom } from './modal/ModalCreateOrUpdateHotel';

const settings = ['edit', 'delete', null];

function GridCardRoom({
  rooms,
  handleOpenNavMenu,
  anchorElNav,
  handelOpenModal,
  handleCloseNavMenu,
}: {
  rooms: ICreateRoom[];
  handleOpenNavMenu: (e: React.MouseEvent<HTMLElement>) => void;
  anchorElNav: Element | null;
  handelOpenModal: (index: number | null) => void;
  handleCloseNavMenu: (setting: string | null, index: number) => void;
}) {
  return (
    <>
      {rooms.length !== 0 ? (
        <Grid container spacing={2} pt={2}>
          {rooms.map((room, i) => (
            <Grid key={i} xs={4} item>
              <Card sx={{ p: 1, position: 'relative' }}>
                <Box sx={{ flexGrow: 1, position: 'absolute', height: 4, right: 3 }}>
                  <IconButton
                    size='medium'
                    aria-label='account of current user'
                    aria-controls='menu-appbar'
                    aria-haspopup='true'
                    onClick={handleOpenNavMenu}
                    color='inherit'
                  >
                    <MoreVertIcon />
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
                    onClose={() => handleCloseNavMenu(null, -1)}
                  >
                    {settings.map((setting) => (
                      <MenuItem
                        key={setting}
                        onClick={() => handleCloseNavMenu(setting, i)}
                      >
                        <Typography textAlign='center' textTransform='capitalize'>
                          {setting}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>

                <Typography>name :{room.nameOfRoom}</Typography>
                <Typography>price :{room.price}</Typography>
                <Typography>number :{room.numberOfRoom}</Typography>
                <Typography>rateDescription :{room.rateDescription}</Typography>
                <Typography>{room.images.length} images</Typography>
              </Card>
            </Grid>
          ))}
          <Grid xs={4} item>
            <Stack alignItems='center' justifyContent='center' height='100%'>
              <Box>
                <Button
                  endIcon={<AddBoxIcon sx={{ fontSize: 40 }} />}
                  onClick={() => handelOpenModal(null)}
                >
                  Add room
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Stack justifyContent='center' alignItems='center' pt={2}>
          <Button
            endIcon={<AddBoxIcon sx={{ fontSize: 50 }} />}
            onClick={() => handelOpenModal(null)}
          >
            <Typography variant='h5'>Add room</Typography>
          </Button>
        </Stack>
      )}
    </>
  );
}

export default GridCardRoom;
