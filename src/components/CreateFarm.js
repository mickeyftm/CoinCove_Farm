import { Box, TextField, Typography, Button, FormControl, Select, MenuItem, FormControlLabel, Checkbox, Hidden } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { pairService } from '../services/api.service';
import { generator, swapFactory, pair, tokenContract, address, swapFactories } from '../utils/ethers.util';
import RoundButton from './common/RoundButton';

const CreateFarm = ({ walletAddress, chain, create, createPool }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [bonusEndDate, setBonusEndDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [farmToken, setFarmToken] = useState('');
  const [lpToken, setLpToken] = useState('');
  const [multiplier, setMultiplier] = useState(1);
  const [amountIn, setAmountIn] = useState('');
  const [rewardBlock, setRewardBlock] = useState('0');
  const [isBonus, setIsBonus] = useState(false);
  const [isFarm, setIsFarm] = useState(true);
  const [isV3, setIsV3] = useState(false);
  const [pairs, setPairs] = useState([]);

  // create pool values
  const [rewardToken, setRewardToken] = useState('');
  const [stakeToken, setStakeToken] = useState('');
  const [apr, setApr] = useState(0);
  const [amount, setAmount] = useState('0');

  const [currentSwap, setCurrentSwap] = useState(0); // for avalanche


  useEffect(() => {
    async function getPairs() {
      if(chain === Number(process.env.REACT_APP_CHAIN)) {
        const res = await pairService.fetchPairs({chain: chain, factory: swapFactories[chain][0]['uniswap']});
        setPairs(res);
      } else {
        const res = await pairService.fetchPairs({chain: chain, factory: swapFactories[chain][currentSwap]['uniswap']});
        setPairs(res);
      }
      
    }
    getPairs();
  }, [currentSwap, chain]);

  useEffect(() => {
    if (!isBonus) {
      setBonusEndDate(startDate);
    }
  }, [startDate, isBonus]);

  const createFarm = () => {
    const startBlock = Math.floor(new Date(startDate).getTime() / 1000);
    const bonusEndBlock = Math.floor(new Date(bonusEndDate).getTime() / 1000);
    create(
      farmToken,
      amountIn,
      lpToken,
      rewardBlock,
      startBlock,
      bonusEndBlock,
      multiplier,
      true
    );
  }
  useEffect(() => {
    async function determineBlockReward() {
      try {
        const startBlock = Math.floor(new Date(startDate).getTime() / 1000);
        const endBlock = Math.floor(new Date(endDate).getTime() / 1000);
        const bonusEndBlock = Math.floor(new Date(bonusEndDate).getTime() / 1000);
        const [blockReward, requiredAmount, fee] = await generator(chain).determineBlockReward(
          parseEther(amountIn),
          startBlock,
          Number(bonusEndBlock),
          multiplier,
          endBlock
        );
        setRewardBlock(blockReward.toString());
        console.log(formatEther(requiredAmount))
      } catch (err) { }
    }
    if (!!amountIn && multiplier > 0) {
      determineBlockReward();
    }
  }, [amountIn, startDate, bonusEndDate, multiplier, endDate, walletAddress]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Hidden smDown>
          <Box sx={{width: '30%'}}></Box>
        </Hidden>
        <Box
          sx={{
            width: '100%',
            px: '10%',
            pt: '5px'
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <Typography onClick={() => setIsFarm(true)} sx={{ mr: '10px', cursor: 'pointer', color: isFarm ? 'white' : 'gray' }} fontStyle='bold' variant='h5' component='Box'>
              Create Farm
            </Typography>
            <Typography onClick={() => setIsFarm(false)} sx={{ ml: '10px', cursor: 'pointer', color: !isFarm ? 'white' : 'gray' }} fontStyle='bold' variant='h5' component='Box'>
              Create Pool
            </Typography>
          </Box>
          {
            isFarm ? (
              <Box sx={{ mt: '20px' }}>
                {
                  (chain === 43114) && (
                    <Box>
                      <RoundButton onClick={() => { setCurrentSwap(0); setLpToken('') }} color={currentSwap !== 0 ? 'secondary' : 'primary'} variant='contained'>Pangolin</RoundButton>
                      <RoundButton onClick={() => { setCurrentSwap(1); setLpToken('') }} color={currentSwap === 1 ? 'primary' : 'secondary'} variant='contained'>Trader Joe</RoundButton>
                    </Box>
                  )
                }
                {
                  (chain === 4) && (
                    <Box>
                      <RoundButton onClick={() => setIsV3(false)} color={isV3 ? 'secondary' : 'primary'} variant='contained'>UniswapV2</RoundButton>
                      <RoundButton onClick={() => { setIsV3(true); setLpToken('') }} color={isV3 ? 'primary' : 'secondary'} variant='contained'>UniswapV3</RoundButton>
                    </Box>
                  )
                }
                {
                  (chain === Number(process.env.REACT_APP_CHAIN)) && (
                    <Box>
                      <RoundButton color='primary' variant='contained'>Pancake Swap</RoundButton>
                    </Box>
                  )
                }
                <Box >
                  <Box>
                    {isV3 ? 'Input uniswapV3 pool' : 'Select uniswap pair'}
                  </Box>
                </Box>
                {
                  isV3 ? (
                    <Box>
                      <TextField value={lpToken} onChange={e => setLpToken(e.target.value)} placeholder='0x...' fullWidth />
                    </Box>
                  ) : (
                    <Box>
                      <FormControl fullWidth>
                        <Select
                          value={lpToken}
                          onChange={e => setLpToken(e.target.value)}
                        >
                          {
                            pairs.map((pair, i) => (
                              <MenuItem key={i} value={pair.address}>
                                {pair.symbol1}/{pair.symbol2}
                              </MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Box>
                  )
                }
                <Box>
                  Token for Reward
                </Box>
                <Box>
                  <TextField value={farmToken} onChange={e => setFarmToken(e.target.value)} fullWidth />
                </Box>
                <Box>
                  Token Amount
                </Box>
                <Box>
                  <TextField value={amountIn} onChange={e => setAmountIn(e.target.value)} fullWidth />
                </Box>
                <Box>
                  Start Date
                </Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      value={startDate}
                      onChange={(newValue) => { setStartDate(newValue) }}
                      renderInput={params => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Box>
                <Box>
                  Multiplier({multiplier}x)
                </Box>
                <Box>
                  <TextField value={multiplier} onChange={e => setMultiplier(e.target.value)} fullWidth />
                </Box>
                <Box>
                  Bonus end date
                </Box>
                <Box>
                  <FormControlLabel control={<Checkbox checked={isBonus} onChange={() => setIsBonus(!isBonus)} />} label="Bonus end date" />
                </Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      value={bonusEndDate}
                      onChange={newValue => setBonusEndDate(newValue)}
                      renderInput={params => <TextField {...params} />}
                      disabled={!isBonus}
                    />
                  </LocalizationProvider>
                </Box>
                <Box>
                  End date
                </Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      value={endDate}
                      onChange={newValue => setEndDate(newValue)}
                      renderInput={params => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Box>
                <Box>
                  Rewards Per Block: {rewardBlock}
                </Box>
                <Box sx={{ py: '10px' }}>
                  <Button onClick={createFarm} variant='contained' fullWidth>Create</Button>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  mt: '20px',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                  }}
                >
                  <Box sx={{ width: '100%', height: '100%' }}>

                    <Box>
                      <Typography variant='h6' component='h6'>
                        Reward Token
                      </Typography>
                    </Box>
                    <Box sx={{ color: 'text.secondary' }}>
                      Paste token address
                    </Box>
                    <Box>
                      <TextField value={rewardToken} onChange={e => setRewardToken(e.target.value)} placeholder='0x...' fullWidth />
                    </Box>
                    <Box>
                      <Typography variant='h6' component='h6'>
                        Stake Token
                      </Typography>
                    </Box>
                    <Box sx={{ color: 'text.secondary' }}>
                      Paste token address
                    </Box>
                    <Box>
                      <TextField value={stakeToken} onChange={e => setStakeToken(e.target.value)} placeholder='0x...' fullWidth />
                    </Box>
                    <Box>
                      <Typography variant='h6' component='h6'>
                        APR percent
                      </Typography>
                    </Box>
                    <Box>
                      <TextField value={apr} onChange={e => setApr(e.target.value)} fullWidth />
                    </Box>
                    <Box>
                      <Typography variant='h6' component='h6'>
                        Amount
                      </Typography>
                    </Box>
                    <Box>
                      <TextField value={amount} onChange={e => setAmount(e.target.value)} fullWidth />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ px: '10px', py: '10px' }}>
                  <Button onClick={createPool} variant='contained' fullWidth>Create</Button>
                </Box>
              </Box>
            )
          }
        </Box>
        <Hidden smDown>
          <Box sx={{width: '30%'}}></Box>
        </Hidden>
      </Box>
    </Box>
  );
}

export default CreateFarm;