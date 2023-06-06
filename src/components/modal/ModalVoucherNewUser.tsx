/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import * as React from 'react';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/app/store';
import BasicModal from './BasicModal';
import IconClose from '../IconClose';

const style = {
  borderColor: 'transparent',
  bgcolor: 'transparent',
};

export default function ModalVoucherNewUser({
  isOpenModal,
  setIsOpenModal,
  setIsOpenSignIn,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenSignIn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { is2FA: isRightCode } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handelClose = () => {
    if (isRightCode) {
      navigate('/account');
    } else {
      setIsOpenSignIn(true);
    }
    setIsOpenModal(false);
  };

  return (
    <>
      <BasicModal
        open={isOpenModal}
        setOpen={setIsOpenModal}
        sx={{
          ...style,
        }}
      >
        <IconClose onClick={() => setIsOpenModal(false)} />
        <img
          onClick={handelClose}
          height='100%'
          src='/Voucher_Cute_Animal.png'
          alt='voucher'
          width='100%'
        />
      </BasicModal>
    </>
  );
}
