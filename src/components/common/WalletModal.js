import { Button, Dialog, Box, List, ListItem, ListItemButton, DialogTitle, IconButton, Hidden } from '@mui/material';
import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Injected, walletConnect } from '../../utils/ethers.util';
import metamaskIcon from '../../assets/metamask.png';
import connectwalletIcon from '../../assets/connectwallet.png';
import CloseIcon from '@mui/icons-material/Close';

const WalletModal = ({ open, onClose, chain }) => {
  const { activate } = useWeb3React();

  const handleWalletConnect = async () => {
    await activate(walletConnect(chain));
    onClose();
  }

  const handleMetaMask = async () => {
    await activate(Injected);
    onClose();
  }
  return (
    <Dialog
      onClose={onClose}
      open={open}
      PaperProps={{
        style: {
          borderRadius: '15px',
          maxWidth: '350px',
          fontFamily: 'Exo',
        }
      }}
    >
      <Box
        sx={{
          background: 'rgb(0,36,48)',
          fontWeight: 'bold'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            pl: '20px',
            fontSize: '18px',
            color: 'white',
            fontWeight: 'bold',
            alignItems: 'center'
          }}
        >
          <Box>
            Connect a wallet
          </Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItem>
            <ListItemButton
              sx={{
                borderRadius: '10px',
                height: '45px',
                fontSize: '18px',
                display: 'flex',
                background: '#266d7a'
              }}
              onClick={handleMetaMask}
            >
              <Box sx={{ fontSize: '14px' }}>
                Metamask
              </Box>
              <Box sx={{ flexGrow: 1 }}></Box>
              <img style={{ height: '30px' }} src={metamaskIcon} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              sx={{
                borderRadius: '10px',
                height: '45px',
                fontSize: '20px',
                display: 'flex',
                background: '#266d7a'
              }}
              onClick={handleWalletConnect}
            >
              <Box sx={{ fontSize: '14px' }}>
                WalletConnect
              </Box>
              <Box sx={{ flexGrow: 1 }}></Box>
              <img style={{ height: '30px' }} src={connectwalletIcon} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <Box
              sx={{
                width: '100%',
                p: '12px',
                fontSize: '12px',
                textAlign: 'left',
                background: '#001126',
                borderRadius: '10px'
              }}
            >
              By connecting a wallet you understand that you are responsible for all of your own actions on the site, and accept the risks that come with using smart contract platforms.
            </Box>
          </ListItem>
        </List>
      </Box>
    </Dialog>
  )
}

export default WalletModal;