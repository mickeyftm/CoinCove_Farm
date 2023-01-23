import { Card, Box, Button } from '@mui/material';
import React from 'react';

const WalletAlert = ({ open, onClose }) => {
  return open && (
    <Card
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        background: 'rgb(0,36,48)',
        p: '20px',
        transform: 'translate(-50%, -50%)',
        borderRadius: '20px',
        zIndex: 100,
        maxWidth: '100%',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          alignItems: 'center',
          fontSize: '18px',
          height: '50%',
          display: 'flex',
        }}
      >
        Please connect your wallet first
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center', mt: '25px', alignItems: 'center', height: '50%'}}>
        <Button size='small' onClick={onClose} variant='contained'>ok</Button>
      </Box>
    </Card>
  );
}

export default WalletAlert;