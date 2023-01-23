import React, { useState } from 'react';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import { Button, Card, Grid, TextField } from '@mui/material';
import farmIcon from '../../assets/icons/farm.svg';
import airdropIcon from '../../assets/icons/airdrop.svg';
import accountIcon from '../../assets/icons/account.svg';
import { farm, farmWeb3, tokenContract, tokenWeb3 } from '../../utils/ethers.util';
import { parseEther } from 'ethers/lib/utils';
import moment from 'moment';
import Hidden from '@mui/material/Hidden';
import { useWeb3React } from '@web3-react/core';
import DateRangeIcon from '@mui/icons-material/DateRange';

const FarmCardV3 = ({ farmInfo, chain, setSelectedFarm }) => {
  const [openStake, setOpenStake] = useState(false);
  const [amountIn, setAmountIn] = useState('0');
  const [amountOut, setAmountOut] = useState('0');


  const { library } = useWeb3React();

  const handleSelectedFarm = () => {
    setSelectedFarm(farmInfo);
  }

  const stake = async () => {
    await tokenWeb3(farmInfo.lptoken, library.getSigner()).approve(farmInfo.address, parseEther(amountIn));
    tokenWeb3(farmInfo.lptoken).once("Approval", async () => {
      const tx = await farmWeb3(farmInfo.address, library.getSigner()).deposit(parseEther(amountIn));
      await tx.wait();
      window.alert("Deposit.");
    });
  }

  const withdraw = async () => {
    const tx = await farmWeb3(farmInfo.address, library.getSigner()).withdraw(parseEther(amountIn));
    await tx.wait();
    window.alert("Withdraw");
  }

  return (
    <Card
      sx={{
        borderRadius: '20px',
        border: '1px solid #2494F3',
        fontFamily: 'Exo',
        pt: '15px',
        my: '10px'
      }}
    >
      <Grid
        onClick={() => setOpenStake(!openStake)}
        sx={{
          cursor: 'pointer'
        }}
        container
        spacing={2}
      >
        <Grid item xs={5}>
          <Box
            sx={{
              height: '100%',
              py: '10px',
              px: '20px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box>
              <Box sx={{ mb: 0 }}>
                {`Farm ${farmInfo.name.toUpperCase()}/${farmInfo.baseToken}`}
              </Box>
              <Box sx={{ fontSize: '12px' }}>
                {
                  farmInfo.start > new Date() && (
                    <Box sx={{ color: 'skyBlue' }}>
                      Farming is not started.
                    </Box>
                  )
                }
                {
                  (farmInfo.start < new Date() && farmInfo.end > new Date()) && (
                    <Box sx={{ color: 'skyBlue' }}>
                      Farming is active.
                    </Box>
                  )
                }
                {
                  farmInfo.bonusEndBlock < new Date() && (
                    <Box sx={{ color: 'skyBlue' }}>
                      Farming has finished.
                    </Box>
                  )
                }
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              ml: '-5px'
            }}
          >
            <Grid container spacing={2}>
              <Grid item sm={10} md={2}>
                <DateRangeIcon sx={{ color: '#1F8BED', mt: '4px', ml: '20px' }} />
              </Grid>
              <Hidden smDown>
                <Grid sx={{ mt: '5px' }} item xs={5}>
                  {moment(farmInfo.start).format('MMM DD YYYY')}
                </Grid>
              </Hidden>
              <Grid sx={{ mt: '5px', ml: '-5px' }} item xs={5}>
                {moment(farmInfo.end).format('MMM DD YYYY')}
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
              ml: '-5px'
            }}
          >
            <Box sx={{ mx: '10px', mt: '3px' }}>
              <img src={airdropIcon} />
            </Box>
            <Box
              sx={{
                mt: '-2px'
              }}
            >
              {Math.trunc(farmInfo.supply)}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              alignItems: 'center'
            }}
          >
            <Box sx={{ mx: '10px' }}>
              <img style={{ height: '20px' }} src={accountIcon} />
            </Box>
            <Box sx={{ marginBottom: '4px' }}>
              {farmInfo.numFarmers}
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* stake */}
      {
        openStake && (
          <Box
            sx={{
              background: '#020826',
              px: '3%',
              py: '1%'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {/* <Box sx={{ mx: '20px' }}>
                <Button onClick={handleSelectedFarm} variant='contained'>add liquidity and stake</Button>
              </Box> */}
              <Box>
                <TextField value={amountIn} onChange={e => setAmountIn(e.target.value)} label="amount" xs={6} fullWidth />
              </Box>
              <Box sx={{ mx: '2%' }}>
                <Button onClick={stake} variant='contained'>stake</Button>
              </Box>
              <Box>
                <TextField value={amountOut} onChange={e => setAmountOut(e.target.value)} label="amount" xs={6} fullWidth />
              </Box>
              <Box sx={{ mx: '2%' }}>
                <Button onClick={withdraw} variant='contained'>withdraw</Button>
              </Box>
            </Box>
          </Box>
        )
      }

    </Card>
  );
}

export default FarmCardV3;