import React from 'react';
import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom';

function BlankLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}

export default BlankLayout;
