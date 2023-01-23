import {
  Dialog,
  DialogTitle,
  TextField,
  Box,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Hidden,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import React, { useEffect, useState } from "react";
import {
  address,
  generator,
  swapFactories,
  tokenContract,
} from "../../utils/ethers.util";
import { formatEther, parseEther } from "ethers/lib/utils";
import { Close } from "@mui/icons-material";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import RoundButton from "../common/RoundButton";
import loading from "../../assets/loading.svg";
import { pairService } from "../../services/api.service";
import Autocomplete from "@mui/material/Autocomplete";
import LptokenDlg from "../common/LptokenDlg";

const CreateFarm = ({ open, onClose, create, walletAddress, chain }) => {
  const [startDate, setstartDate] = useState(new Date());
  const [startBlock, setStartBlock] = useState(0);
  const [bonusEndDate, setBonusEndDate] = useState(new Date());
  const [bonusBlock, setBonusBlock] = useState(0);
  const [endDate, setEndDate] = useState(new Date());
  const [endBlock, setEndBlock] = useState(0);
  const [farmToken, setFarmToken] = useState("");
  const [lpToken, setLpToken] = useState("");
  const [multiplier, setMultiplier] = useState(1);
  const [amountIn, setAmountIn] = useState("");
  const [rewardBlock, setRewardBlock] = useState("0");
  const [isV3, setIsV3] = useState(false);
  const [currentSwap, setCurrentSwap] = useState(0); // for avalanche
  const [activeStep, setActiveStep] = useState(0);
  const [farmSymbol, setFarmSymbol] = useState();
  const [farmDecimals, setFarmDecimals] = useState();
  const [farmBalance, setFarmBalance] = useState();
  const [farmTokenName, setFarmTokenName] = useState();
  const [tokenLoading, setTokenLoading] = useState();
  const [now, setNow] = useState(new Date());
  const [tokenPrice, setTokenPrice] = useState(1);
  const [apy, setApy] = useState(0);
  const [liquidity, setLiquidity] = useState(0);
  const [pairs, setPairs] = useState([]);
  const [lpname, setLpname] = useState("");
  const [openList, setOpenList] = useState(false);
  const [lockUnit, setLockUnit] = useState("month");
  const [periodPerx, setPeriodPerx] = useState(0);
  const [isBonus, setIsBonus] = useState(false);
  const [isBonus1, setIsBonus1] = useState(false);

  useEffect(() => {
    async function getPairs() {
      if (chain === Number(process.env.REACT_APP_CHAIN)) {
        const res = await pairService.fetchPairs({
          chain: chain,
          factory: swapFactories[chain][0]["uniswap"],
        });
        setPairs(res);
      } else {
        const res = await pairService.fetchPairs({
          chain: chain,
          factory: swapFactories[chain][currentSwap]["uniswap"],
        });
        setPairs(res);
      }
    }
    getPairs();
  }, [currentSwap, chain]);

  // get farm token info when changing farm token
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

  // formate current block when open
  useEffect(() => {
    if (open) {
      const block = Math.floor(new Date().getTime() / 1000);
      setNow(block);
    }
  }, [open]);

  // calculate apy with rewardBlock
  useEffect(() => {
    if (rewardBlock <= 0) return;
    console.log(rewardBlock);
    const tempapy = (formatEther(rewardBlock) * 3600 * 24 * 365) / amountIn;
    setApy((tempapy * tokenPrice) / liquidity);
  }, [rewardBlock, tokenPrice, liquidity]);

  // calculate start block when change start date
  useEffect(() => {
    const block = Math.floor(new Date(startDate).getTime() / 1000);
    setStartBlock(block);
  }, [startDate]);

  // calculate bonus end block when changing bonus end date
  useEffect(() => {
    const block = Math.floor(new Date(bonusEndDate).getTime() / 1000);
    setBonusBlock(block);
  }, [bonusEndDate]);

  // calculate end block when changing end date
  useEffect(() => {
    const block = Math.floor(new Date(endDate).getTime() / 1000);
    setEndBlock(block);
  }, [endDate]);

  // calculate start date when change start block
  useEffect(() => {
    if (startBlock <= 0) return;
    const date = new Date(startBlock * 1000);
    setstartDate(date);
  }, [startBlock]);

  // calculate bonus end date when changing bonus end block
  useEffect(() => {
    if (bonusBlock <= 0) return;
    const date = new Date(bonusBlock * 1000);
    setBonusEndDate(date);
  }, [bonusBlock]);

  // calculate end date when changing end block
  useEffect(() => {
    if (endBlock <= 0) return;
    const date = new Date(endBlock * 1000);
    setEndDate(date);
  }, [endBlock]);

  const handleClose = () => {
    setFarmToken("");
    setFarmSymbol();
    onClose();
  };

  const createFarm = () => {
    const startBlock = Math.floor(new Date(startDate).getTime() / 1000);
    const bonusEndBlock = Math.floor(new Date(bonusEndDate).getTime() / 1000);
    let unit;
    if (lockUnit === "day") {
      unit = 3600 * 24;
    } else if (lockUnit === "week") {
      unit = 3600 * 24 * 7;
    } else {
      unit = 3600 * 24 * 30;
    }
    const lockPeriod = periodPerx * unit;

    if (chain === Number(process.env.REACT_APP_CHAIN)) {
      create(
        farmToken,
        amountIn,
        lpToken.address,
        rewardBlock,
        startBlock,
        bonusEndBlock,
        multiplier,
        lockPeriod,
        false,
        0
      );
    } else {
      create(
        farmToken,
        amountIn,
        lpToken.address,
        rewardBlock,
        startBlock,
        bonusEndBlock,
        multiplier,
        false,
        currentSwap
      );
    }
  };

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
      console.log("check calll", determineBlockReward());
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

  useEffect(() => {
    if (startDate <= bonusEndDate) return;
    setBonusEndDate(startDate);
  }, [startDate]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <LptokenDlg
        setLpToken={setLpToken}
        chain={chain}
        open={openList}
        onClose={() => setOpenList(false)}
        pairs={pairs}
      />
      <Box
        sx={{
          border: "2px solid #2494F3",
          overflowX: "hidden",
          background: "#000314",
        }}
      >
        <DialogTitle sx={{ display: "flex" }}>
          <Box sx={{ fontWeight: "bold" }}>Create Farm</Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <Box
          sx={{
            minWidth: "280px",
            maxWidth: "640px",
            height: "500px",
            p: "10px",
            background: "#030927",
          }}
        >
          <Box sx={{ width: "100%", height: "100%" }}>
            <PerfectScrollbar style={{ padding: "30px" }}>
              {chain === 43114 && (
                <Box>
                  <RoundButton
                    onClick={() => {
                      setCurrentSwap(0);
                      setLpToken("");
                    }}
                    color={currentSwap !== 0 ? "secondary" : "primary"}
                    variant="contained"
                  >
                    Pangolin
                  </RoundButton>
                  <RoundButton
                    onClick={() => {
                      setCurrentSwap(1);
                      setLpToken("");
                    }}
                    color={currentSwap === 1 ? "primary" : "secondary"}
                    variant="contained"
                  >
                    Trader Joe
                  </RoundButton>
                </Box>
              )}
              {chain === 4 && (
                <Box
                  sx={{
                    mb: "20px",
                  }}
                >
                  <RoundButton
                    onClick={() => setIsV3(false)}
                    color={isV3 ? "secondary" : "primary"}
                    variant="contained"
                  >
                    UniswapV2
                  </RoundButton>
                  <RoundButton
                    onClick={() => {
                      setIsV3(true);
                      setLpToken("");
                    }}
                    color={isV3 ? "primary" : "secondary"}
                    variant="contained"
                  >
                    UniswapV3
                  </RoundButton>
                </Box>
              )}
              {chain === Number(process.env.REACT_APP_CHAIN) && (
                <Box
                  sx={{
                    mb: "20px",
                  }}
                >
                  <RoundButton color="primary" variant="contained">
                    Pancakeswap
                  </RoundButton>
                </Box>
              )}
              <Box
                sx={{
                  border: "2px solid green",
                  m: "-10px",
                  p: "10px",
                  borderRadius: "10px",
                }}
              >
                {/* start stepper */}
                <Stepper activeStep={activeStep} orientation="vertical">
                  {/* step 0 */}
                  <Step>
                    <StepLabel onClick={() => setActiveStep(0)}>
                      Farm which token?
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ color: "text.secondary", mb: "5px" }}>
                        Paste token address
                      </Box>
                      <Box>
                        <TextField
                          size="small"
                          value={farmToken}
                          onChange={(e) => setFarmToken(e.target.value)}
                          placeholder="0x..."
                          fullWidth
                        />
                      </Box>
                      <Box sx={{ width: "100%" }}>
                        <Box
                          sx={{
                            mt: "20px",
                            position: "relative",
                            display: "flex",
                            justifyContent: "start",
                            width: "50%",
                          }}
                        >
                          {/* <Box sx={{ flexGrow: 1 }}></Box> */}
                          <TextField
                            size="small"
                            sx={{ width: "100%" }}
                            value={amountIn}
                            onChange={(e) => setAmountIn(e.target.value)}
                            label={`Balance: ${
                              !!farmBalance ? farmBalance : 0
                            } ${!!farmSymbol ? farmSymbol : ""}`}
                            variant="filled"
                            focused
                          />
                          <button
                            onClick={() => setAmountIn(farmBalance)}
                            style={{
                              position: "absolute",
                              right: "5px",
                              bottom: "7px",
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
                      </Box>
                      {
                        // tokenLoading ? (
                        //   <img src={loading} />
                        // ) :
                        //   !!farmSymbol ? (
                        //     <Box>
                        //       <Box
                        //         sx={{
                        //           p: '10px',
                        //           border: '1px solid green',
                        //           borderRadius: '10px'
                        //         }}
                        //       >
                        //         <Box
                        //           sx={{
                        //             display: 'flex',
                        //             alignItems: 'center'
                        //           }}
                        //         >
                        //           <Box
                        //             sx={{
                        //               pl: '10px',
                        //               fontSize: '28px',
                        //             }}
                        //           >
                        //             {farmTokenName}
                        //           </Box>
                        //           <Box sx={{ flexGrow: 1 }}></Box>
                        //           <Box>
                        //             <IconButton onClick={() => setFarmToken('')}>
                        //               <Close />
                        //             </IconButton>
                        //           </Box>
                        //         </Box>
                        //         <Box>
                        //           {farmToken}
                        //         </Box>
                        //         <Box>
                        //           Symbol: {farmSymbol}
                        //         </Box>
                        //         <Box>
                        //           Decimals: {farmDecimals}
                        //         </Box>
                        //         <Box>
                        //           Your raw balance: {farmBalance}
                        //         </Box>
                        //       </Box>
                        //       <Box
                        //         sx={{
                        //           mt: '20px',
                        //           position: 'relative',
                        //           display: 'flex'
                        //         }}
                        //       >
                        //         <Box sx={{ flexGrow: 1 }}></Box>
                        //         <TextField size='small' value={amountIn} onChange={e => setAmountIn(e.target.value)} label={`Balance: ${farmBalance} ${farmSymbol}`} variant='filled' focused />
                        //         <button
                        //           onClick={() => setAmountIn(farmBalance)}
                        //           style={{
                        //             position: 'absolute',
                        //             right: '1px',
                        //             bottom: '1px',
                        //             padding: '5px',
                        //             cursor: 'pointer',
                        //             background: '#266d7a',
                        //             outline: 'none'
                        //           }}
                        //           variant='contained'
                        //           size='small'
                        //         >
                        //           Max
                        //         </button>
                        //       </Box>
                        //     </Box>
                        //   ) : (
                        //     <>
                        //       <Box sx={{ color: 'text.secondary', mb: '5px' }}>
                        //         Paste token address
                        //       </Box>
                        //       <Box>
                        //         <TextField size='small' value={farmToken} onChange={e => setFarmToken(e.target.value)} placeholder='0x...' fullWidth />
                        //       </Box>
                        //     </>
                        //   )
                      }
                      <Hidden smDown>
                        <Box sx={{ width: "480px" }}></Box>
                      </Hidden>
                      <Box
                        sx={{
                          mt: "10px",
                        }}
                      >
                        <Button
                          onClick={() => setActiveStep(1)}
                          variant="contained"
                          size="small"
                        >
                          Continue
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* step 1 */}
                  <Step>
                    <StepLabel onClick={() => setActiveStep(1)}>
                      {chain == process.env.REACT_APP_CHAIN
                        ? "Select Pancakeswap pair"
                        : chain == 43114
                        ? currentSwap == 0
                          ? "Select Pangolin pair"
                          : "Select Trader joe pair"
                        : "Select AMM pair"}
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ color: "text.secondary", mb: "5px" }}>
                        {chain == process.env.REACT_APP_CHAIN
                          ? "Select Pancakeswap pair"
                          : chain == 43114
                          ? currentSwap == 0
                            ? "Select Pangolin pair"
                            : "Select Trader joe pair"
                          : "Select AMM pair"}
                      </Box>
                      {isV3 ? (
                        <Box>
                          <TextField
                            size="small"
                            value={lpToken}
                            onChange={(e) => setLpToken(e.target.value)}
                            placeholder="0x..."
                            fullWidth
                          />
                        </Box>
                      ) : (
                        <Box>
                          <Box
                            sx={{
                              position: "relative",
                            }}
                          >
                            <TextField
                              fullWidth
                              value={
                                !!lpToken
                                  ? `${lpToken.symbol1}/${lpToken.symbol2}`
                                  : ""
                              }
                              readOnly
                              size="small"
                              onClick={() => setOpenList(true)}
                            />
                            {!!lpToken && (
                              <IconButton
                                onClick={() => setLpToken()}
                                sx={{
                                  position: "absolute",
                                  right: "10px",
                                }}
                              >
                                <Close />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      )}
                      <Box sx={{ color: "text.secondary", mt: "10px" }}>
                        This MUST be a valid AMM pair. The contract checks this
                        is a AMM pair on farm creation. If it is not the script
                        will revert
                      </Box>
                      <Box
                        sx={{
                          mt: "10px",
                        }}
                      >
                        <Button
                          onClick={() => setActiveStep(2)}
                          variant="contained"
                          size="small"
                        >
                          Continue
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* step 2 */}
                  <Step>
                    <StepLabel onClick={() => setActiveStep(2)}>
                      Start Date
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ color: "text.secondary", mb: "10px" }}>
                        We reccommend a start block at least 24 hours in advance
                        to give people time to get ready to farm.
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
                      <Box sx={{ color: "text.secondary", my: "10px" }}>
                        {`* must be above ${now}`}
                      </Box>
                      <Box
                        sx={{
                          mt: "10px",
                        }}
                      >
                        <Button
                          onClick={() => setActiveStep(3)}
                          variant="contained"
                          size="small"
                        >
                          Continue
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* step 3 */}
                  <Step>
                    <StepLabel onClick={() => setActiveStep(3)}>
                      End Date
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ color: "text.secondary", mb: "5px" }}>
                        Date
                      </Box>
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
                      <Box
                        sx={{ color: "text.secondary", mb: "5px", mt: "10px" }}
                      >
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
                      <Hidden smDown>
                        <Box sx={{ width: "480px" }}></Box>
                      </Hidden>
                      <Box
                        sx={{
                          mt: "10px",
                        }}
                      >
                        <Button
                          onClick={() => setActiveStep(4)}
                          variant="contained"
                          size="small"
                        >
                          continue
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* step 4 */}
                  <Step>
                    <StepLabel onClick={() => setActiveStep(4)}>
                      Bonus Periods (Optional)
                    </StepLabel>
                    <StepContent
                      sx={{
                        position: "relative",
                      }}
                    >
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isBonus}
                              onChange={() => setIsBonus(!isBonus)}
                            />
                          }
                          sx={{ color: `${isBonus ? "white" : "gray"}` }}
                          label="Enable"
                        />
                      </Box>
                      {isBonus ? null : (
                        <Box
                          className="checkOverlay"
                          sx={{
                            top: "37px",
                            width: "98%",
                            height: "90%",
                            position: "absolute",
                            backgroundColor: "#ffffff3b",
                            left: "10px",
                            zIndex: "9",
                            cursor: "no-drop",
                            borderRadius: "5px",
                          }}
                        ></Box>
                      )}

                      <Box sx={{ color: "text.secondary" }}>
                        Multiplier ({multiplier}x)
                      </Box>
                      <Box sx={{ color: "text.secondary", mb: "10px" }}>
                        {`Bonus periods start at the start block and end at the below specified block. For no bonus period set the multiplier to '1' and the bonus end block to ${now}`}
                      </Box>
                      <Box>
                        <TextField
                          size="small"
                          value={multiplier}
                          onChange={(e) => setMultiplier(e.target.value)}
                          fullWidth
                        />
                      </Box>
                      <Box
                        sx={{ color: "text.secondary", mb: "5px", mt: "10px" }}
                      >
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
                      {bonusBlock != startBlock && (
                        <>
                          <Box
                            sx={{
                              color: "text.secondary",
                              mb: "5px",
                              mt: "10px",
                            }}
                          >
                            Block Number
                          </Box>
                          <Box>
                            <TextField
                              size="small"
                              value={bonusBlock}
                              onChange={(e) => setBonusBlock(e.target.value)}
                            />
                          </Box>
                          <Box sx={{ color: "text.secondary", my: "10px" }}>
                            {`* must be >= ${now}`}
                          </Box>
                        </>
                      )}
                      <Box
                        sx={{
                          mt: "10px",
                        }}
                      >
                        <Button
                          onClick={() => setActiveStep(5)}
                          variant="contained"
                          size="small"
                        >
                          Continue
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* step 5 */}
                  <Step>
                    <StepLabel onClick={() => setActiveStep(5)}>
                      Lock Period (Optional)
                    </StepLabel>
                    <StepContent
                      sx={{
                        position: "relative",
                        ml: "0px",
                        mb: `${activeStep == 5 ? "10px" : "0px"}`,
                      }}
                      className="checkOverlay1111212"
                    >
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isBonus1}
                              onChange={() => setIsBonus1(!isBonus1)}
                            />
                          }
                          sx={{ color: `${isBonus1 ? "white" : "gray"}` }}
                          label="Enable"
                        />
                      </Box>
                      {isBonus1 ? null : (
                        <Box
                          className="checkOverlay111"
                          sx={{
                            top: "37px",
                            width: "98%",
                            height: "75%",
                            position: "absolute",
                            backgroundColor: "#ffffff3b",
                            left: "13px",
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
                      <Box
                        sx={{
                          mt: "10px",
                        }}
                      >
                        <Button
                          onClick={() => setActiveStep(6)}
                          variant="contained"
                          size="small"
                        >
                          finish
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                </Stepper>
              </Box>
              {/* apy calculator */}
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
          <Button onClick={createFarm} variant="contained" fullWidth>
            Create
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default CreateFarm;
