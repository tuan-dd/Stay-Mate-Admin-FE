import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import dayjs from 'dayjs';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import { IReview } from '@/utils/interface';
import { fToNow } from '@/utils/formatTime';

function CardReview({
  review,
  i,
  handelClickTargetReview,
}: {
  review: IReview;
  i: number;
  handelClickTargetReview: (i: number) => void;
}) {
  return (
    <Card key={review.slug} sx={{ p: 2, width: '100%' }}>
      <Stack flexDirection='row' columnGap={2}>
        <Box>
          <Typography variant='h4' color='primary'>
            Star Rating: {review.starRating}
          </Typography>
          <Typography variant='body1'>Author: {review.author.name}</Typography>
          <Typography variant='body1'>
            Stayed
            {` ${
              (dayjs(review.endDate).unix() - dayjs(review.startDate).unix()) / 86400
            } night in ${dayjs(review.startDate).format('MMMM YYYY')} `}
          </Typography>
          {review.images.length !== 0 && (
            <ImageList
              variant='quilted'
              cols={3}
              rowHeight={60}
              sx={{ m: 0, mt: 3, width: '210px' }}
            >
              {review.images.slice(0, 3).map((item, index) => (
                <ImageListItem
                  sx={{
                    cursor: 'pointer',
                    width: '50px',
                    marginLeft: 1,
                  }}
                  key={index}
                  cols={1}
                  rows={1}
                  // onClick={() => handelOpenImages(i)}
                >
                  <img src={item} alt={review.author.name} loading='lazy' width='50px' />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Box>
        <Divider orientation='vertical' flexItem />
        <Stack>
          <Typography variant='h5'>Room Types order</Typography>
          <CardActions>
            {review.rooms?.map((room) => (
              <Typography
                variant='body1'
                key={room.name}
                color='primary'
                onClick={() => {}}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {room.quantity} {room.name}
              </Typography>
            ))}
          </CardActions>
        </Stack>
        <Box sx={{ flexGrow: 1 }}>
          <Stack
            spacing={1}
            sx={{
              minHeight: 110,
              border: 'solid 1px',
              mb: 1,
              p: 1,
              position: 'relative',
              borderRadius: 5,
            }}
          >
            <Stack minHeight={120} spacing={1}>
              <Chip label='Customer review' color='info' />
              <Typography variant='body1'>{review.context}</Typography>
              <Typography textAlign='end' variant='body2' color='text.primary'>
                {fToNow(review.updatedAt)}
              </Typography>
            </Stack>
            <Divider />
            <Stack width='100%' spacing={1} position='relative' minHeight={120}>
              {review.isReply && review.reply ? (
                <Stack spacing={1}>
                  <Chip label='Your Reply' color='info' />
                  <Typography width='100%'>{review.reply.context}</Typography>
                  <Typography
                    variant='body2'
                    color='text.primary'
                    sx={{ position: 'absolute', bottom: 2, right: 4 }}
                  >
                    {fToNow(review.reply.updatedAt)}
                  </Typography>
                  <Button
                    sx={{ position: 'absolute', bottom: -10, left: 5, mt: 1 }}
                    onClick={() => handelClickTargetReview(i)}
                  >
                    Edit
                  </Button>
                </Stack>
              ) : (
                <Box>
                  <Typography textAlign='center'>Reply help you more money</Typography>
                  <Button
                    sx={{ position: 'absolute', bottom: -2, left: '38%', mt: 1 }}
                    onClick={() => handelClickTargetReview(i)}
                  >
                    Write Reply
                  </Button>
                </Box>
              )}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}

export default CardReview;
