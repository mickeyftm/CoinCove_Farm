import { Box, Button, Card, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import SearchInput from './common/SearchInput';
import SearchIcon from '@mui/icons-material/Search';
import RoundButton from './common/RoundButton';
import Hidden from '@mui/material/Hidden';

const Tokens = ({ farmTokens, stakeTokens }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const optimizeAddress = (address) => {
    return `${address.substring(0, 5)}..${address.substring(address.length - 5)}`
  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          width: '100%',
          minHeight: '60vh',
          bgcolor: '#010621',
          p: '2%'
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: '#030930',
            p: '20px'
          }}
        >
          {/* tab header */}
          <Box
            sx={{
              display: 'flex',
              mx: '80px'
            }}
          >
            <Button onClick={() => setTabIndex(0)}>
              <Typography color='white' variant='h6' component='h6'>
                FARMABLE TOKENS
              </Typography>
            </Button>
            <Button onClick={() => setTabIndex(1)}>
              <Typography color='white' variant='h6' component='h6'>
                STAKING
              </Typography>
            </Button>
            <Box sx={{ flexGrow: 1 }}></Box>
            <Hidden smDown>
              <Box
                sx={{ position: 'relative', width: '250px' }}
              >
                <SearchInput
                  sx={{
                    position: 'absolute'
                  }}
                  placeholder='Search tokens'
                />
                <IconButton
                  sx={{ position: 'absolute', right: '0px', top: '4px' }}
                >
                  <SearchIcon />
                </IconButton>
              </Box>
            </Hidden>
          </Box>
          {/* token list */}
          {
            tabIndex == 0 ? (
              <Box sx={{ mt: '30px' }}>
                {
                  farmTokens.map((token, i) => (
                    <Card
                      key={i}
                      sx={{
                        width: '100%',
                        borderRadius: '20px',
                        p: '3%',
                        display: 'flex',
                        alignItems: 'center',
                        my: '20px'
                      }}
                    >
                      <Box>
                        {/* <img src={pkgIcon} /> */}
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex' }}>
                          <Box sx={{ fontSize: '30px', mr: '10px' }}>
                            {token.symbol}
                          </Box>
                          {/* <Box sx={{ color: 'primary.main' }}>
                            {`$${token.price}`}
                          </Box> */}
                        </Box>
                        <Box sx={{ color: 'primary.main' }}>
                          {token.name}
                        </Box>
                      </Box>
                      <Box sx={{ flexGrow: 1 }}></Box>
                      {/* <Box sx={{ mx: '20px' }}>
                        <RoundButton color='secondary' variant='contained'>View farms</RoundButton>
                      </Box> */}
                      {/* <Box sx={{ mx: '20px' }}>
                        <RoundButton color='secondary' variant='contained'>Uniswap</RoundButton>
                      </Box> */}
                      <Box sx={{ mx: '20px' }}>
                        <RoundButton color='secondary' variant='contained'>Etherscan</RoundButton>
                      </Box>
                      <Box sx={{ mx: '20px' }}>
                        <RoundButton color='secondary' variant='contained'>
                          {optimizeAddress(token.address)}
                        </RoundButton>
                      </Box>
                    </Card>
                  ))
                }
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  {/* <Pagination count={10} variant='outlined' /> */}
                </Box>
              </Box>
            ) : (
              <Box sx={{ mt: '30px' }}>
                {
                  stakeTokens.map((token, i) => (
                    <Card
                      key={i}
                      sx={{
                        width: '100%',
                        borderRadius: '20px',
                        py: '5px',
                        px: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        my: '10px'
                      }}
                    >
                      <Box>
                        {/* <img src={pkgIcon} /> */}
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex' }}>
                          <Box sx={{ fontSize: '30px', mr: '10px' }}>
                            {token.symbol}
                          </Box>
                          {/* <Box sx={{ color: 'primary.main' }}>
                            {`$${token.price}`}
                          </Box> */}
                        </Box>
                        <Box sx={{ color: 'primary.main' }}>
                          {token.name}
                        </Box>
                      </Box>
                      <Box sx={{ flexGrow: 1 }}></Box>
                      {/* <Box sx={{ mx: '20px' }}>
                        <RoundButton color='secondary' variant='contained'>View farms</RoundButton>
                      </Box>
                      <Box sx={{ mx: '20px' }}>
                        <RoundButton color='secondary' variant='contained'>Uniswap</RoundButton>
                      </Box> */}
                      <Box sx={{ mx: '20px' }}>
                        <RoundButton color='secondary' variant='contained'>Etherscan</RoundButton>
                      </Box>
                      <Box sx={{ mx: '20px' }}>
                        <RoundButton color='secondary' variant='contained'>
                          {optimizeAddress(token.address)}
                        </RoundButton>
                      </Box>
                    </Card>
                  ))
                }
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  {/* <Pagination count={10} variant='outlined' /> */}
                </Box>
              </Box>
            )
          }

        </Box>
      </Box>
    </Box>
  )
}

export default Tokens;
