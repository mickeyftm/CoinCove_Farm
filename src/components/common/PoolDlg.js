import {
  Dialog,
  DialogTitle,
  Grid,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Close } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { parseEther } from "ethers/lib/utils";
import { generator, tokenContract } from "../../utils/ethers.util";
import { formatEther } from "ethers/lib/utils";

const PoolDlg = ({ open, onClose, create, walletAddress, chain }) => {
  const [rewardToken, setRewardToken] = useState("");
  const [stakeToken, setStakeToken] = useState("");
  const [apr, setApr] = useState(0);
  const [amountIn, setAmountIn] = useState("0");
  const [multiplier, setMultiplier] = useState(1);
  const [bonusEndDate, setBonusEndDate] = useState(new Date());
  const [now, setNow] = useState(new Date());
  const [bonusBlock, setBonusBlock] = useState(0);
  const [lockUnit, setLockUnit] = useState("month");
  const [periodPerx, setPeriodPerx] = useState(0);

  const [isBonus, setIsBonus] = useState(false);
  const [isBonus1, setIsBonus1] = useState(false);
  const [farmBalance, setFarmBalance] = useState();
  const [farmSymbol, setFarmSymbol] = useState();
  const [farmToken, setFarmToken] = useState("");
  const [tokenLoading, setTokenLoading] = useState();
  const [farmDecimals, setFarmDecimals] = useState();
  const [farmTokenName, setFarmTokenName] = useState();

  const [tokenPrice, setTokenPrice] = useState(1);
  const [liquidity, setLiquidity] = useState(0);
  const [rewardBlock, setRewardBlock] = useState("0");
  const [apy, setApy] = useState(0);
  const [currentSwap, setCurrentSwap] = useState(0);

  const [startDate, setstartDate] = useState(new Date());
  const [startBlock, setStartBlock] = useState(0);
  const [endDate, setEndDate] = useState(new Date());
  const [endBlock, setEndBlock] = useState(0);

  const createPool = () => {
    // create(
    //   rewardToken,
    //   stakeToken,
    //   apr,
    //   amountIn,
    //   startDate,
    //   endDate
    // );

    const startBlock = Math.floor(new Date(startDate).getTime() / 1000);
    // const bonusEndBlock = Math.floor(new Date(bonusEndDate).getTime() / 1000);
    let unit;
    if (lockUnit === "day") {
      unit = 3600 * 24;
    } else if (lockUnit === "week") {
      unit = 3600 * 24 * 7;
    } else {
      unit = 3600 * 24 * 30;
    }
    // const lockPeriod = periodPerx * unit;

    if (chain === Number(process.env.REACT_APP_CHAIN)) {
      create(
        rewardToken,
        stakeToken,
        apy,
        amountIn,
        startBlock,
        endBlock
        // bonusEndBlock,
        // multiplier,
        // lockPeriod,
        // false,
      );
    } else {
      create(
        rewardToken,
        stakeToken,
        apy,
        amountIn,
        startBlock,
        endBlock
        // bonusEndBlock,
        // multiplier,
        // false,
        // currentSwap
      );
    }
  };

  // Start Date ====================

  // calculate start block when change start date
  useEffect(() => {
    const block = Math.floor(new Date(startDate).getTime() / 1000);
    setStartBlock(block);
  }, [startDate]);

  // formate current block when open
  useEffect(() => {
    if (open) {
      const block = Math.floor(new Date().getTime() / 1000);
      setNow(block);
    }
  }, [open]);
  // Start Date ====================

  // calculate end date when changing end block
  useEffect(() => {
    if (endBlock <= 0) return;
    const date = new Date(endBlock * 1000);
    setEndDate(date);
  }, [endBlock]);

  useEffect(() => {
    if (rewardBlock <= 0) return;
    console.log(rewardBlock);
    const tempapy = (formatEther(rewardBlock) * 3600 * 24 * 365) / amountIn;
    setApy((tempapy * tokenPrice) / liquidity);
  }, [rewardBlock, tokenPrice, liquidity]);

  // calculate end block when changing end date
  useEffect(() => {
    const block = Math.floor(new Date(endDate).getTime() / 1000);
    setEndBlock(block);
  }, [endDate]);

  useEffect(() => {
    const block = Math.floor(new Date(bonusEndDate).getTime() / 1000);
    setBonusBlock(block);
  }, [bonusEndDate]);

  useEffect(() => {
    if (bonusBlock <= 0) return;
    const date = new Date(bonusBlock * 1000);
    setBonusEndDate(date);
  }, [bonusBlock]);

  useEffect(() => {
    async function getFarmToken() {
      if (farmToken.length === 42) {
        setTokenLoading(true);
        const symbol = await tokenContract(chain, farmToken).symbol();
        setFarmSymbol(symbol);
        const decimals = await tokenContract(chain, farmToken).decimals();
        setFarmDecimals(decimals);
        const balance = await tokenContract(chain, farmToken).balanceOf(
          walletAddress
        );
        setFarmBalance(formatEther(balance));
        const name = await tokenContract(chain, farmToken).name();
        setFarmTokenName(name);
        setTokenLoading(false);
      } else {
        setFarmSymbol();
        setFarmDecimals();
        setFarmBalance();
        setFarmTokenName();
      }
    }
    getFarmToken();
  }, [farmToken]);

  // determine reward per block
  useEffect(() => {
    async function determineBlockReward() {
      try {
        const startBlock = Math.floor(new Date(startDate).getTime() / 1000);
        const endBlock = Math.floor(new Date(endDate).getTime() / 1000);
        const bonusEndBlock = Math.floor(
          new Date(bonusEndDate).getTime() / 1000
        );
        if (chain === Number(process.env.REACT_APP_CHAIN)) {
          const [blockReward, requiredAmount, fee] = await generator(
            chain,
            0
          ).determineBlockReward(
            parseEther(amountIn),
            startBlock,
            Number(bonusEndBlock),
            multiplier,
            endBlock
          );
          setRewardBlock(blockReward.toString());
          setLiquidity(formatEther(requiredAmount));
        } else {
          const [blockReward, requiredAmount, fee] = await generator(
            chain,
            currentSwap
          ).determineBlockReward(
            parseEther(amountIn),
            startBlock,
            Number(bonusEndBlock),
            multiplier,
            endBlock
          );
          setRewardBlock(blockReward.toString());
          setLiquidity(formatEther(requiredAmount));
        }
      } catch (err) {}
    }
    if (!!amountIn && multiplier > 0) {
      determineBlockReward();
    }
  }, [
    amountIn,
    startDate,
    bonusEndDate,
    multiplier,
    endDate,
    walletAddress,
    liquidity,
    tokenPrice,
  ]);

  const handleClose = () => {
    setFarmToken("");
    setFarmSymbol();
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <Box
        sx={{
          border: "2px solid #2494F3",
          overflowX: "hidden",
          background: "#000314",
          fontFamily: "Exo",
        }}
      >
        <DialogTitle sx={{ display: "flex" }}>
          <Box sx={{ fontWeight: "bold" }}>Create Pool</Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <Box
          sx={{
            maxWidth: "600px",
            minWidth: "300px",
            p: "10px",
            background: "#030927",
          }}
        >
          <Box sx={{ width: "100%", height: "100%" }}>
            <PerfectScrollbar style={{ padding: "30px" }}>
              <Box>
                <Typography variant="h6" component="h6">
                  Reward Token
                </Typography>
              </Box>
              <Box sx={{ color: "text.secondary", mb: "5px" }}>
                Paste token address
              </Box>
              <Box>
                <TextField
                  size="small"
                  value={rewardToken}
                  onChange={(e) => setRewardToken(e.target.value)}
                  placeholder="0x..."
                  fullWidth
                />
              </Box>
              <Box
                sx={{
                  mt: "20px",
                }}
              >
                <Typography variant="h6" component="h6">
                  Stake Token
                </Typography>
              </Box>
              <Box sx={{ color: "text.secondary", mb: "5px" }}>
                Paste token address
              </Box>
              <Box>
                <TextField
                  size="small"
                  value={stakeToken}
                  onChange={(e) => setStakeToken(e.target.value)}
                  placeholder="0x..."
                  fullWidth
                />
              </Box>
              <Box
                sx={{
                  mt: "20px",
                  position: "relative",
                  display: "flex",
                  justifyContent: "start",
                  width: "100%",
                }}
              >
                {/* <Box sx={{ flexGrow: 1 }}></Box> */}
                <TextField
                  size="small"
                  sx={{ width: "100%" }}
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value)}
                  label={`Balance: ${!!farmBalance ? farmBalance : 0} ${
                    !!farmSymbol ? farmSymbol : ""
                  }`}
                  variant="filled"
                  focused
                />
                <button
                  onClick={() => setAmountIn(farmBalance)}
                  style={{
                    position: "absolute",
                    right: "5px",
                    bottom: "5px",
                    padding: "5px",
                    cursor: "pointer",
                    background: "#266d7a",
                    outline: "none",
                    border: "none",
                  }}
                  variant="contained"
                  size="small"
                >
                  Max
                </button>
              </Box>

              {/* =============== Dates ===================== */}
              {/* Start Date */}
              <Box
                sx={{
                  mt: "20px",
                }}
              >
                <Typography variant="h6" component="h6">
                  Start Date
                </Typography>
                <Box
                  sx={{ color: "text.secondary", mb: "10px", fontSize: "13px" }}
                >
                  We reccommend a start block at least 24 hours in advance to
                  give people time to get ready to farm.
                </Box>
                <Box
                  sx={{
                    color: "text.secondary",
                    mb: "5px",
                  }}
                >
                  Date
                </Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      value={startDate}
                      onChange={(newValue) => {
                        setstartDate(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField size="small" {...params} />
                      )}
                    />
                  </LocalizationProvider>
                </Box>
                <Box
                  sx={{
                    color: "text.secondary",
                    mb: "5px",
                    mt: "20px",
                  }}
                >
                  Block Number
                </Box>
                <Box>
                  <TextField
                    size="small"
                    value={startBlock}
                    onChange={(e) => setStartBlock(e.target.value)}
                  />
                </Box>
                <Box
                  sx={{ color: "text.secondary", my: "10px", fontSize: "13px" }}
                >
                  {`* must be above ${now}`}
                </Box>
                <Box
                  sx={{
                    mt: "10px",
                  }}
                >
                  {/* <Button onClick={() => setActiveStep(3)} variant='contained' size='small'>Continue</Button> */}
                </Box>
              </Box>

              {/* End Date  */}

              <Box
                sx={{
                  mt: "20px",
                }}
              >
                <Typography variant="h6" component="h6">
                  End Date
                </Typography>
                <Box sx={{ color: "text.secondary", mb: "5px" }}>Date</Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      value={endDate}
                      onChange={(newValue) => {
                        setEndDate(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField size="small" {...params} />
                      )}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ color: "text.secondary", mb: "5px", mt: "10px" }}>
                  Block number
                </Box>
                <Box>
                  <TextField
                    size="small"
                    value={endBlock}
                    onChange={(e) => setEndBlock(e.target.value)}
                  />
                </Box>
                <Box sx={{ color: "text.secondary", my: "10px" }}>
                  {`* must be >= ${now}`}
                </Box>
                <Box
                  sx={{
                    mt: "10px",
                  }}
                >
                  {/* <Button onClick={() => setActiveStep(4)} variant='contained' size='small'>continue</Button> */}
                </Box>
              </Box>

              {/* =============== Dates ===================== */}

              <Box
                sx={{
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    mt: "20px",
                  }}
                >
                  <Typography variant="h6" component="h6">
                    Bonus Periods (Optional)
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isBonus}
                          onChange={() => setIsBonus(!isBonus)}
                        />
                      }
                      sx={{ color: `${isBonus ? "white" : "gray"}`, ml: "0px" }}
                      label="Enable"
                    />
                  </Typography>
                </Box>
                {isBonus ? null : (
                  <Box
                    className="checkOverlay"
                    sx={{
                      top: "35px",
                      width: "100%",
                      height: "92%",
                      position: "absolute",
                      backgroundColor: "#ffffff3b",
                      left: "-7px",
                      zIndex: "9",
                      cursor: "no-drop",
                      borderRadius: "5px",
                    }}
                  ></Box>
                )}
                <Box sx={{ color: "text.secondary" }}>
                  Multiplier ({multiplier}x)
                </Box>
                <Box
                  sx={{
                    my: "5px",
                    textAlign: "left",
                    fontSize: "14px",
                    color: "text.secondary",
                  }}
                >
                  {`Bonus periods start at the start block and end at the below specified block. For no bonus period set the multiplier to '1' and the bonus end block to ${now}`}
                </Box>
                <Box sx={{ pr: "15px" }}>
                  <TextField
                    size="small"
                    value={multiplier}
                    onChange={(e) => setMultiplier(e.target.value)}
                    fullWidth
                  />
                </Box>
                <Box sx={{ color: "text.secondary", mb: "5px", mt: "10px" }}>
                  Bonus end date
                </Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      value={bonusEndDate}
                      onChange={(newValue) => {
                        setBonusEndDate(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField size="small" {...params} />
                      )}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ color: "text.secondary", mb: "5px", mt: "10px" }}>
                  Block Number
                </Box>
                <Box>
                  <TextField
                    size="small"
                    value={bonusBlock}
                    onChange={(e) => setBonusBlock(e.target.value)}
                  />
                </Box>
                <Box
                  sx={{
                    my: "5px",
                    textAlign: "left",
                    fontSize: "14px",
                    color: "text.secondary",
                  }}
                >
                  {`* must be >= ${now}`}
                </Box>
              </Box>

              <Box
                sx={{
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    mt: "20px",
                  }}
                >
                  <Typography variant="h6" component="h6">
                    Lock Periods (Optional)
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isBonus1}
                          onChange={() => setIsBonus1(!isBonus1)}
                        />
                      }
                      sx={{
                        color: `${isBonus1 ? "white" : "gray"}`,
                        ml: "0px",
                      }}
                      label="Enable"
                    />
                  </Typography>
                </Box>
                {isBonus1 ? null : (
                  <Box
                    className="checkOverlay"
                    sx={{
                      top: "35px",
                      width: "100%",
                      height: "68%",
                      position: "absolute",
                      backgroundColor: "#ffffff3b",
                      left: "-7px",
                      zIndex: "9",
                      cursor: "no-drop",
                      borderRadius: "5px",
                    }}
                  ></Box>
                )}
                <Grid sx={{ width: "480px" }} container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      value={periodPerx}
                      onChange={(e) => setPeriodPerx(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Select
                        value={lockUnit}
                        onChange={(e) => setLockUnit(e.target.value)}
                        size="small"
                      >
                        <MenuItem value="day">days</MenuItem>
                        <MenuItem value="week">weeks</MenuItem>
                        <MenuItem value="month">months</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              <Box
                sx={{
                  border: "2px solid green",
                  mx: "-10px",
                  mt: "20px",
                  p: "10px",
                  borderRadius: "10px",
                  fontFamily: "Exo",
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h6" component="h6">
                      APY calculator
                    </Typography>
                  </Box>
                  <Box sx={{ color: "text.secondary", mb: "10px" }}>
                    *Complete above steps first
                  </Box>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          type="number"
                          size="small"
                          value={tokenPrice}
                          onChange={(e) => setTokenPrice(e.target.value)}
                          label="Expected token price"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          type="number"
                          size="small"
                          value={liquidity}
                          onChange={(e) => setLiquidity(e.target.value)}
                          label="Expected liquidity"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box
                    sx={{
                      my: "20px",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            color: "text.secondary",
                            mb: "10px",
                            ml: "25px",
                            textAlign: "left",
                            fontSize: "14px",
                          }}
                        >
                          Block Reward
                        </Box>
                        <Box
                          sx={{
                            textAlign: "left",
                            ml: "25px",
                          }}
                        >
                          {rewardBlock === 0 ? "?" : rewardBlock}
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            color: "text.secondary",
                            mb: "10px",
                            ml: "25px",
                            textAlign: "left",
                            fontSize: "14px",
                          }}
                        >
                          Expected APY
                        </Box>
                        <Box
                          sx={{
                            textAlign: "left",
                            ml: "25px",
                          }}
                        >
                          {apy.toFixed(2)}%
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </PerfectScrollbar>
          </Box>
        </Box>
        <Box sx={{ px: "10px", py: "10px" }}>
          <Button onClick={createPool} variant="contained" fullWidth>
            Create
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default PoolDlg;
