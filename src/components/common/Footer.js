import { Box } from '@mui/system';
import React from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import logo from '../../assets/logo.svg';

const Footer = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '1366px',
          alignItems: 'center'
        }}
      >
        <Box sx={{mx: '20px'}}>
          Terms
        </Box>
        <Box sx={{mx: '20px'}}>
          Privacy
        </Box>
        <Box sx={{flexGrow:1}}></Box>
        <Box>
          <img style={{ height: '30px' }} src={logo} />
        </Box>
        <Box sx={{flexGrow:1}}></Box>
        <Box sx={{mx: '20px'}}>
          <TwitterIcon />
        </Box>
        <Box sx={{mx: '20px'}}>
          <InstagramIcon />
        </Box>
      </Box>
    </Box>

  )
}

export default Footer;