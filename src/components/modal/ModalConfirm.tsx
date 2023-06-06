import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { LoadingButton } from '@mui/lab';
import BasicModal from './BasicModal';

function ModalConfirm({
  isOpenModal,
  setIsOpenModal,
  handelConfirm,
  content,
  pending = false,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  handelConfirm: (isConfirm: boolean) => void;
  content: string;
  pending: boolean;
}) {
  return (
    <BasicModal open={isOpenModal} setOpen={setIsOpenModal}>
      <Card>
        <CardContent>
          <Typography>{content}</Typography>
        </CardContent>
        <LoadingButton onClick={() => handelConfirm(true)}>Confirm </LoadingButton>
        <LoadingButton onClick={() => setIsOpenModal(false)} loading={pending}>
          Cancel
        </LoadingButton>
      </Card>
    </BasicModal>
  );
}

export default ModalConfirm;
