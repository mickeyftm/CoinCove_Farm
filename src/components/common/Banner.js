import { Box, Hidden, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { useState } from 'react';
import RoundTabButton from './RoundTabButton';
import coinIcon from '../../assets/icons/coin.svg';
import farmIcon from '../../assets/icons/farm.svg';
import pickaxeIcon from '../../assets/icons/pickaxe.svg';
import stakeIcon from '../../assets/icons/stake.svg';
import accountIcon from '../../assets/icons/account.svg';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { networks } from '../../utils/network.util';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import RoundButton from './RoundButton';
import ethereumIcon from '../../assets/tokenIcons/ethereum-ether-logo.png';
import bnbIcon from '../../assets/tokenIcons/bsc-bnb-logo.png';
import avaxIcon from '../../assets/tokenIcons/avalanche-avax-logo.png';


const chainLogos = {
  56: bnbIcon,
  97: bnbIcon,
  43114: avaxIcon,
  4: ethereumIcon
}

const chainColors = process.env.NODE_ENV === 'development' ?
  {
    97: {
      main: 'orange',
      hover: 'darkOrange'
    },
    43114: {
      main: 'pink',
      hover: 'hotPink'
    },
    // 4: {
    //   main: 'skyBlue',
    //   hover: 'lightBlue'
    // }
  } : {
    56: {
      main: 'orange',
      hover: 'darkOrange'
    },
    43114: {
      main: 'pink',
      hover: 'hotPink'
    },
    // 4: {
    //   main: 'skyBlue',
    //   hover: 'lightBlue'
    // }
  }
const Banner = ({ setChain, chain }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openMenu, setOpenMenu] = useState();
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChain = async (chainId) => {
    if (chainId !== 4) {
      await window.ethereum.request(
        {
          "id": 1,
          "jsonrpc": "2.0",
          "method": "wallet_addEthereumChain",
          "params": [networks[chainId]]
        }
      );
    }
    await window.ethereum.request(
      {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "wallet_switchEthereumChain",
        "params": [{
          chainId: networks[chainId].chainId
        }]
      }
    );
    setChain(chainId);
    setAnchorEl(null);
    // navigate(`/pools?chain=${chainId}`);
  }

  return (
    <Box sx={{width: '100%'}}>
      {/* tab buttons */}
      <Hidden mdUp>
        <Box
          sx={{
            width: '100%',
            px: '10px'
          }}
        >
          <Box>
            <RoundButton
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              sx={{ mx:0, background: chainColors[chain]?.main, ":hover": { background: chainColors[chain]?.hover } }} variant='contained'
              fullWidth
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <img style={{ marginRight: '20px', height: '30px' }} src={chainLogos[chain]} />
                <Box sx={{ flexGrow: 1 }}></Box>
                {networks[chain]?.chainName}
                <Box sx={{ flexGrow: 1 }}></Box>
                <ExpandMoreIcon />
              </Box>
            </RoundButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              PaperProps={{
                sx: {
                  width: '100%',
                  background: '#030927',
                }
              }}
            >
              {/* <MenuItem
                sx={{
                  background: '#7389DF',
                  m: '5px',
                  borderRadius: '10px',
                  display: 'flex',
                  fontSize: '14px',
                  ":hover": {
                    background: 'lightBlue'
                  }
                }}
                onClick={() => handleChain(4)}
              >
                <img style={{ height: '30px', marginRight: '10px' }} src={ethereumIcon} />
                <Box>Ethereum</Box>
              </MenuItem> */}
              <MenuItem
                sx={{
                  background: 'pink',
                  m: '5px',
                  borderRadius: '10px',
                  display: 'flex',
                  fontSize: '14px',
                  ":hover": {
                    background: 'hotPink'
                  }
                }}
                onClick={() => handleChain(43114)}
              >
                <img style={{ height: '30px', marginRight: '10px' }} src={avaxIcon} />
                <Box>Avalanche</Box>
              </MenuItem>
              <MenuItem
                sx={{
                  background: '#C88E0D',
                  m: '5px',
                  borderRadius: '10px',
                  display: 'flex',
                  fontSize: '14px',
                  ":hover": {
                    background: 'darkOrange'
                  }
                }}
                onClick={() => handleChain(56)}
              >
                <img style={{ height: '30px', marginRight: '10px' }} src={bnbIcon} />
                <Box>Bianance Smart Chain</Box>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Hidden>
    </Box>
  )
}

export default Banner;