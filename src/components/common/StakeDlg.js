import { Box, Button, Card, Divider, Grid, IconButton, TextField, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { address, coinSymbols, farmWeb3, routerWeb3, swapFactories, tokenContract, tokenWeb3 } from '../../utils/ethers.util';
import { networks } from '../../utils/network.util';
import { Close } from '@mui/icons-material';
import { useWeb3React } from '@web3-react/core';

const StakeDlg = ({ farm, chain, walletAddress, onClose }) => {
  const [balance0, setBalance0] = useState('0');
  const [balance1, setBalance1] = useState('0');
  const [symbol0, setSymbol0] = useState('');
  const [symbol1, setSymbol1] = useState('');
  const [isEther, setIsEther] = useState();
  const [amountIn0, setAmountIn0] = useState('0');
  const [amountIn1, setAmountIn1] = useState('0');
  const [isApproved, setIsApproved] = useState();
  const [lpBalance, setLpBalance] = useState('0');
  const [amountIn, setAmountIn] = useState('0');

  const { library } = useWeb3React();


  useEffect(() => {
    async function getPairTokens() {
      if (!farm || !walletAddress) return;
      if (farm.token0.toLowerCase() == address[chain][0]['wether'].toLowerCase()) {
        const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
        const balance = await provider.getBalance(walletAddress);
        setBalance0(balance);
        setSymbol0(coinSymbols[chain]);
        setIsEther(0);
      } else {
        const balance = await tokenContract(chain, farm.token0).balanceOf(walletAddress);
        const symbol = await tokenContract(chain, farm.token0).symbol();
        setBalance0(balance);
        setSymbol0(symbol);
      }
      if (farm.token1.toLowerCase() == address[chain][0]['wether'].toLowerCase()) {
        const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
        const balance = await provider.getBalance(walletAddress);
        setBalance1(balance);
        setSymbol1(coinSymbols[chain]);
        setIsEther(1);
      } else {
        const balance = await tokenContract(chain, farm.token1).balanceOf(walletAddress);
        const symbol = await tokenContract(chain, farm.token1).symbol();
        setBalance1(balance);
        setSymbol1(symbol);
      }
      const balance = await tokenContract(chain, farm.lptoken).balanceOf(walletAddress);
      setLpBalance(balance);
    }
    getPairTokens();
  }, [farm]);

  const handleApprove = async () => {
    try {
      if (isEther !== 0) {
        const tx = await tokenWeb3(farm.token0, library.getSigner()).approve(swapFactories[chain][0]['router'], parseEther(amountIn0));
        await tx.wait();
      }
      if (isEther !== 1) {
        const tx = await tokenWeb3(farm.token1, library.getSigner()).approve(swapFactories[chain][0]['router'], parseEther(amountIn1));
        await tx.wait();
      }
      setIsApproved(true);
    } catch (err) {
      console.log(err)
    }
  }

  const addLiquidity = async () => {
    const deadline = Math.round(Date.now() / 1000) + 100;
    console.log('------Add Liquidity-------')
    console.log('token0: ', farm.token0);
    console.log('token1: ', farm.token1);
    console.log('walletAddress: ', walletAddress);
    console.log('amountIn0: ', amountIn0);
    console.log('amountIn1: ', amountIn1);
    if (isEther == 0) {
      const tx = await routerWeb3(chain, library.getSigner()).addLiquidityETH(
        farm.token1,
        parseEther(amountIn1),
        0,
        0,
        walletAddress,
        deadline,
        { value: parseEther(amountIn0) }
      );
      await tx.wait();
    } else if (isEther == 1) {
      const tx = await routerWeb3(chain, library.getSigner()).addLiquidityETH(
        farm.token0,
        parseEther(amountIn0),
        0,
        0,
        walletAddress,
        deadline,
        { value: parseEther(amountIn1) }
      );
      await tx.wait();
    } else {
      const tx = await routerWeb3(chain, library.getSigner()).addLiquidity(
        farm.token0,
        farm.token1,
        parseEther(amountIn0),
        parseEther(amountIn1),
        0,
        0,
        walletAddress,
        deadline,
      );
      await tx.wait();
    }
  }

  const stake = async () => {
    try {
      const approveTx = await tokenWeb3(farm.lptoken, library.getSigner()).approve(farm.address, parseEther(amountIn));
      await approveTx.wait();

      const tx = await farmWeb3(farm.address, library.getSigner()).deposit(parseEther(amountIn));
      await tx.wait();
      window.alert("Deposit.");

      onClose();
    } catch (err) {
      console.log(err)
    }
  }

  return !!farm && (
    <Card
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        background: 'rgb(0,36,48)',
        p: '20px',
        pl: '30px',
        pb: '40px',
        transform: 'translate(-50%, -50%)',
        maxWidth: '650px',
        minWidth: '450px',
        borderRadius: '10px',
        zIndex: '1000'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '50px',
          alignItems: 'center'
        }}
      >
        <Box sx={{ fontSize: '18px', fontWeight: 'bold' }}>
          Add Liquidity
        </Box>
        <Box sx={{ flexGrow: 1 }}></Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <Box
        sx={{
          pt: '10px'
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: 'center', fontSize: '14px' }}>
          <Grid item xs={12} md={4} >
            <Box
              sx={{
                display: 'flex',
                mb: '5px'
              }}
            >
              Balance: {Number(formatEther(balance0)).toFixed(1)} {symbol0}
              <Box sx={{ flexGrow: 1 }}></Box>
              <button onClick={() => setAmountIn0(formatEther(balance0))} style={{ cursor: 'pointer', background: '#2494F3', color: 'white', border: 'none', borderRadius: '5px' }}>Max</button>
            </Box>
            <Box>
              <TextField size='small' value={amountIn0} onChange={e => setAmountIn0(e.target.value)} fullWidth />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                mb: '5px'
              }}
            >
              Balance: {Number(formatEther(balance1)).toFixed(1)} {symbol1}
              <Box sx={{ flexGrow: 1 }}></Box>
              <button onClick={() => setAmountIn1(formatEther(balance1))} style={{ cursor: 'pointer', background: '#2494F3', color: 'white', border: 'none', borderRadius: '5px' }}>Max</button>
            </Box>
            <Box>
              <TextField size='small' value={amountIn1} onChange={e => setAmountIn1(e.target.value)} fullWidth />
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box>
              {
                isApproved ? (
                  <Button onClick={addLiquidity} sx={{ mt: '20px' }} variant='contained'>Add liquidity</Button>
                ) : (
                  <Button onClick={handleApprove} sx={{ mt: '20px' }} variant='contained'>Approve</Button>
                )
              }
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ my: '20px' }}>
          <Divider />
        </Box>
        <Box>
          <Box sx={{ fontSize: '18px', fontWeight: 'bold', mb: '20px' }}>
            Stake
          </Box>
          <Grid container spacing={2} sx={{ alignItems: 'center', fontSize: '14px' }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', mb: '5px' }}>
                Balance: {Number(formatEther(lpBalance)).toFixed(1)}
                <Box sx={{ flexGrow: 1 }}></Box>
                <button onClick={() => setAmountIn(formatEther(lpBalance))} style={{ cursor: 'pointer', background: '#2494F3', color: 'white', border: 'none', borderRadius: '5px' }}>Max</button>
              </Box>
              <TextField size='small' value={amountIn} onChange={e => setAmountIn(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button onClick={stake} sx={{ mt: '20px' }} variant='contained'>Stake</Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Card>
  );
}

export default StakeDlg;