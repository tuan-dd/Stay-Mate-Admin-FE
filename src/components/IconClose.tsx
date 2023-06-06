import { IconButton, styled, IconButtonProps } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StyleIconClose = styled(IconButton)(({ theme }) => ({
  position: 'absolute' as const,
  top: 5,
  right: 2,
  zIndex: 10000,
  backgroundColor: theme.palette.secondary.light,
}));

export default function IconClose({
  sx,
  fontSize = 'large',
  ...other
}: { fontSize?: 'small' | 'inherit' | 'medium' | 'large' } & IconButtonProps) {
  return (
    <StyleIconClose {...other} sx={{ ...sx }}>
      <CloseIcon fontSize={fontSize} />
    </StyleIconClose>
  );
}
