import Card from '@mui/material/Card';
import { Alert, Stack, Typography } from '@mui/material';
import { IMembership } from '@/utils/interface';
import { fDate, fToNow } from '@/utils/formatTime';
import { EPricePackage } from '@/utils/enum';

function CardMemberShip({ membership }: { membership: IMembership }) {
  return (
    <Card sx={{ position: 'relative', width: 400, p: 2 }}>
      <Typography sx={{ position: 'absolute', top: 5, right: 5 }} variant='body2'>
        {fToNow(membership.createdAt)}
      </Typography>
      <Stack spacing={1} mt={1.5}>
        {membership.isExpire && <Alert severity='info'>Membership was expired </Alert>}
        <Typography>package :{membership.package}</Typography>
        <Typography>Start date :{fDate(membership.timeStart)}</Typography>
        <Typography>End date :{fDate(membership.timeEnd)}</Typography>
        <Typography>Price :{EPricePackage[membership.package]} $</Typography>
      </Stack>
    </Card>
  );
}

export default CardMemberShip;
