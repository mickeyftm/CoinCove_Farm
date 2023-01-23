import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';


const RoundTabButton = styled(Button) ({
  borderRadius: '25px',
  fontWeight: 'bold',
  textTransform: 'capitalize',
  maxWidth: '200px',
  color: 'white',
  fontSize: '18px',
  border: '2px solid #2494F3'
});

export default RoundTabButton;