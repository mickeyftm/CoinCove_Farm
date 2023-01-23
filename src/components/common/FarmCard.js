import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import Typography from "@mui/material/Typography";
import {
  Button,
  Card,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import farmIcon from "../../assets/icons/farm.svg";
import airdropIcon from "../../assets/icons/airdrop.svg";
import accountIcon from "../../assets/icons/account.svg";
import {
  farm,
  farmWeb3,
  tokenContract,
  tokenWeb3,
} from "../../utils/ethers.util";
import { formatEther, parseEther } from "ethers/lib/utils";
import moment from "moment";
import Hidden from "@mui/material/Hidden";
import { useWeb3React } from "@web3-react/core";
import DateRangeIcon from "@mui/icons-material/DateRange";
import loading from "../../assets/loading.svg";
import defaultIcon from "../../assets/defaultIcon.png";

const admin = process.env.REACT_APP_ADMIN.toLowerCase();

const FarmCard = ({
  farmInfo,
  chain,
  setSelectedFarm,
  handleVisible,
  walletAddress,
}) => {
  const [openStake, setOpenStake] = useState(false);
  const [amountIn, setAmountIn] = useState("0");
  const [amountOut, setAmountOut] = useState("0");
  const [liq, setLiq] = useState("");
  const [lockUnit, setLockUnit] = useState("month");
  const [lockPeriod, setLockPeriod] = useState();
  const [boostPeriod, setBoostPeriod] = useState();
  const [boostNum, setBoostNum] = useState(0);
  const [boostx, setBoostx] = useState(1);
  const [userBalance, setUserBalance] = useState();
  const [farmers, setFarmers] = useState(0);
  const [apy, setApy] = useState(0);

  const chainsName = {
    56: "smartchain",
    43114: "avalanchec",
  };

  useEffect(() => {
    async function getLiq() {
      const info = await farm(chain, farmInfo.address).farmInfo();
      const supply = info.farmableSupply;
      const period = info.lockPeriod;
      setLockPeriod(Number(period));
      setLiq(formatEther(supply));
      setFarmers(Number(info.numFarmers));
      const blockReward = info.blockReward.mul(86400 * 365);
      setApy(Number(formatEther(blockReward)).toFixed(1));
    }

    async function getUserInfo() {
      if (!walletAddress) return;
      const userinfo = await farm(chain, farmInfo.address).userInfo(
        walletAddress
      );
      setUserBalance(formatEther(userinfo.amount));
    }
    getLiq();
    getUserInfo();
  }, [farmInfo, walletAddress]);

  useEffect(() => {
    let period;
    if (lockUnit === "day") {
      period = boostNum * 86400;
    } else if (lockUnit === "week") {
      period = boostNum * 86400 * 7;
    } else {
      period = boostNum * 86400 * 30;
    }
    setBoostPeriod(period);
    setBoostx(period / lockPeriod);
  }, [boostNum, lockUnit]);

  const { library } = useWeb3React();

  const handleSelectedFarm = () => {
    setSelectedFarm(farmInfo);
  };

  const lock = async () => {
    await farmWeb3(farmInfo.address, library.getSigner()).lock(boostPeriod);
  };

  const withdraw = async () => {
    const tx = await farmWeb3(farmInfo.address, library.getSigner()).withdraw(
      parseEther(amountIn)
    );
    await tx.wait();
    window.alert("Withdraw");
  };

  const claim = async () => {
    try {
      const rewards = await farmWeb3(
        farmInfo.address,
        library.getSigner()
      ).pendingReward(walletAddress);
      const tx = await farmWeb3(
        farmInfo.address,
        library.getSigner()
      ).safeRewardTransfer(walletAddress, rewards);
      await tx.wait();
    } catch (err) {}
  };

  return (
    <Card
      sx={{
        borderRadius: "20px",
        border: "1px solid #2494F3",
        fontFamily: "Exo",
        py: "15px",
        my: "10px",
        px: "20px",
      }}
    >
      <Grid
        onClick={() => setOpenStake(!openStake)}
        sx={{
          cursor: "pointer",
          alignItems: "center",
        }}
        container
        spacing={2}
      >
        <Grid item md={6} sm={7} xs={7}>
          <Grid sx={{ alignItems: "center" }} container spacing={2}>
            {/* <Hidden smDown> */}
            <Grid
              item
              md={4}
              sm={5}
              xs={5}
              sx={{
                display: "flex",
                marginRight: {
                  md: "0px",
                  sm: "0px",
                  xs: "0px",
                },
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                style={{
                  marginTop: "5px",
                  zIndex: "9",
                  borderRadius: "100%",
                }}
                className={"dualImg"}
                src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${
                  chainsName[farmInfo.chain]
                }/assets/${farmInfo.token0}/logo.png`}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = defaultIcon;
                }}
              />
              <img
                style={{
                  marginTop: "5px",
                  borderRadius: "100%",
                  marginLeft: "-15px",
                }}
                className={"dualImg"}
                src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${
                  chainsName[farmInfo.chain]
                }/assets/${farmInfo.token1}/logo.png`}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = defaultIcon;
                }}
              />
              <Typography
                variant="h3"
                component="h4"
                sx={{ marginTop: "5px", marginLeft: "10px" }}
              >
                {`${farmInfo.name.toUpperCase()}`}
              </Typography>
            </Grid>

            {/* <Hidden smDown> */}
            <Grid
              item
              md={4}
              sm={4}
              xs={4}
              sx={{
                marginLeft: {
                  md: "0px",
                  sm: "0px",
                  xs: "0px",
                },
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                style={{
                  marginTop: "5px",
                  borderRadius: "100%",
                  marginRight: "10px",
                }}
                className={"dualImg"}
                src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${
                  chainsName[farmInfo.chain]
                }/assets/${farmInfo.address}/logo.png`}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = defaultIcon;
                }}
              />
              <Typography
                variant="h3"
                component="h3"
                className="asdasda"
                sx={{ marginTop: "5px" }}
              >
                {`${farmInfo.baseToken}`}
              </Typography>
            </Grid>

            {/* <Hidden smDown> */}
            {/* <Grid item xs={1}>
            </Grid> */}
            {/* </Hidden> */}

            <Grid item md={4} sm={3} xs={3}>
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  marginLeft: {
                    md: "0px",
                    sm: "0px",
                    xs: "0px",
                  },
                }}
              >
                {`${apy}%`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={4} sm={3} xs={3}>
          <Grid sx={{ alignItems: "center" }} container spacing={0}>
            <Hidden smDown>
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
                item
                xs={1}
              >
                <DateRangeIcon sx={{ color: "#1F8BED" }} />
              </Grid>
              <Grid item md={5} sm={5} xs={5}>
                <Typography variant="h3" component="h3">
                  {moment(farmInfo.start).format("MMM DD YYYY")}
                </Typography>
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
                item
                xs={1}
              >
                <DateRangeIcon sx={{ color: "#1F8BED" }} />
              </Grid>
            </Hidden>
            <Grid item md={5} sm={5} xs={12}>
              <Typography variant="h3" component="h3">
                {moment(farmInfo.end).format("MMM DD YYYY")}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                }}
              >
                <Box sx={{ mx: "10px", mt: "5px" }}>
                  <img src={airdropIcon} />
                </Box>
                {liq == 0 ? (
                  <img style={{ height: "20px" }} src={loading} />
                ) : (
                  <Typography variant="h3" component="div">
                    {Math.trunc(liq)}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Hidden smDown>
                  <Box sx={{ mr: "10px", mt: "5px" }}>
                    <img style={{ height: "20px" }} src={accountIcon} />
                  </Box>
                  <Typography variant="h3" component="h3">
                    {farmers}
                  </Typography>
                </Hidden>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* stake */}
      {openStake && (
        <Box
          sx={{
            background: "#020826",
            alignItems: "center",
          }}
        >
          <Grid
            sx={{ alignItems: "center", px: "30px", py: "10px" }}
            container
            spacing={2}
          >
            <Hidden smDown>
              <Grid item xs={1}></Grid>
            </Hidden>
            <Grid item md={2} xs={12}>
              <Button
                onClick={handleSelectedFarm}
                fullWidth
                variant="contained"
              >
                add LQ & stake
              </Button>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                size="small"
                fullWidth
                value={amountOut}
                onChange={(e) => setAmountOut(e.target.value)}
                label="amount"
                xs={6}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <Button fullWidth onClick={withdraw} variant="contained">
                withdraw
              </Button>
            </Grid>
            <Grid item md={2} xs={12}>
              <Button
                fullWidth
                onClick={claim}
                variant="contained"
                disabled={walletAddress}
              >
                claim
              </Button>
            </Grid>
            <Hidden smDown>
              <Grid item xs={1}></Grid>
            </Hidden>
          </Grid>
          {(String(walletAddress).toLowerCase() === admin ||
            String(walletAddress).toLowerCase() ===
              String(farmInfo.owner).toLowerCase()) &&
            !!walletAddress && (
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!farmInfo.invisible}
                      onChange={(e) =>
                        handleVisible(farmInfo._id, !e.target.checked)
                      }
                    />
                  }
                  label="show/hide from site"
                />
              </Box>
            )}
          {userBalance > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: "20px",
              }}
            >
              <Box
                sx={{
                  width: "480px",
                }}
              >
                <Box>
                  Boost {boostx === 0 || !boostx ? 1 : boostx.toFixed(1)}x
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      size="small"
                      value={boostNum}
                      onChange={(e) => setBoostNum(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
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
                  <Grid item xs={4}>
                    <Button onClick={lock} variant="contained" size="small">
                      Lock
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Card>
  );
};

export default FarmCard;
