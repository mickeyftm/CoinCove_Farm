import React from 'react';
import { Button, Card, IconButton, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Close } from '@mui/icons-material';

const ReferralDlg = ({referral, onClose}) => {

  const copyReferral = () => {
    navigator.clipboard.writeText(referral);
  }

  return !!referral && (
    <Card
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        background: 'rgb(0,36,48)',
        padding: '30px',
        transform: 'translate(-50%, -50%)',
        maxWidth: '650px',
        minWidth: '300px',
        borderRadius: '20px',
        zIndex: 100
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            mb: '20px'
          }}
        >
          <Typography variant='h5' component='h6' color='orange'>
            Create your own referral link!
          </Typography>
          <Box sx={{flexGrow: 1}}></Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box>
          <TextField value={referral} fullWidth />
        </Box>
        <Box
          sx={{
            textAlign: 'left',
            fontSize: '18px',
            mt: '20px'
          }}
        >
          When a pool is created using your referral link, of the CoinCove team's profits, you receive 10% and the pool creator receives 10% back as a reward for the referral, so you both profit!
        </Box>
        <Box
          sx={{
            mt: '20px',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button onClick={copyReferral} variant='contained'>
            Copy referral Link
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

export default ReferralDlg;