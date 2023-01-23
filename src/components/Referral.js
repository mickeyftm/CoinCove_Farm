import { Box, Button, Card, Grid, TextField, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { utils } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { address, generator, generatorWeb3 } from '../utils/ethers.util';


const Referral = ({ walletAddress, chain }) => {
  const [referralFund, setReferralFund] = useState(0);
  const [referralIn, setReferralIn] = useState('');
  const [referralOut, setReferralOut] = useState('');
  const [amount, setAmount] = useState('0');
  const [signerAddr, setSignerAddr] = useState('');
  const [referralToken, setReferralToken] = useState('');

  const { library } = useWeb3React();
  
  const signReferral = async() => {
    console.log(walletAddress, referralIn)
    const hash = await generator(chain).getMessageHash(
      walletAddress,
      parseEther(amount),
      referralIn
    );
    const sig = await library.getSigner().signMessage(utils.arrayify(hash));
    const tx = await generatorWeb3(chain, library.getSigner()).storeReferralInfo(
      sig,
      parseEther(amount),
      referralToken
    );
    await tx.wait();
    window.alert("registered.");
  }

  const claimReferral = async () => {
    const tx = await generatorWeb3(chain, library.getSigner()).claimReferral(
      signerAddr,
      referralOut
    );
    await tx.wait();
    window.alert("claimed.");
  }

  useEffect(() => {
    async function getFund() {
      const fund = await generator(chain).referralFund(walletAddress, address[chain]['rewardToken']);
      setReferralFund(formatEther(fund));
    }
    if (!!walletAddress) {
      getFund();
    }
  }, [walletAddress]);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          
        }}
      >
        <Card
          sx={{
            p: '2%'
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <Typography variant='h6' component='h6'>
              Create Referral link
            </Typography>
            <Box sx={{ flexGrow: 1 }}></Box>
            <Typography variant='h6' component='h6'>
              Fund : {Math.trunc(referralFund)}
            </Typography>
          </Box>
          <Box sx={{ px: '30px', mt: '20px' }}>
            <Box sx={{ my: '10px' }}>
              <TextField value={referralIn} onChange={e=>setReferralIn(e.target.value)} label="Input referral key" fullWidth />
            </Box>
            <Box sx={{ my: '10px' }}>
              <TextField value={amount} onChange={e=>setAmount(e.target.value)} label="Input amount" fullWidth />
            </Box>
            <Box sx={{ my: '10px' }}>
              <TextField value={referralToken} onChange={e=>setReferralToken(e.target.value)} label="Input referral Token" fullWidth />
            </Box>
            <Box sx={{ my: '10px' }}>
              <Button onClick={signReferral} variant='contained' fullWidth>Sign referral</Button>
            </Box>
          </Box>
        </Card>
        <Card
          sx={{
            p: '20px',
            mt: '40px'
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <Typography variant='h6' component='h6'>
              Claim Referral
            </Typography>
          </Box>
          <Box sx={{ px: '30px', mt: '20px' }}>
            <Box sx={{ my: '10px' }}>
              <TextField value={referralOut} onChange={e=>setReferralOut(e.target.value)} label="Input referral key" fullWidth />
            </Box>
            <Box sx={{ my: '10px' }}>
              <TextField value={signerAddr} onChange={e=>setSignerAddr(e.target.value)} label="Input signer address" fullWidth />
            </Box>
            <Box sx={{ my: '10px' }}>
              <Button onClick={claimReferral} variant='contained' fullWidth>Claim referral</Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default Referral;