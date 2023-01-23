import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  FormControlLabel,
  Grid,
  Hidden,
  TextField,
  Typography,
  Box,
  Switch,
} from "@mui/material";
import moment from "moment";
import DateRangeIcon from "@mui/icons-material/DateRange";

import defaultIcon from "../../assets/defaultIcon.png";
import airdropIcon from "../../assets/icons/airdrop.svg";
import accountIcon from "../../assets/icons/account.svg";
import { spoolWeb3, tokenWeb3, spool, pool } from "../../utils/ethers.util";
import { useWeb3React } from "@web3-react/core";
import { parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";

const admin = process.env.REACT_APP_ADMIN.toLowerCase();

const PoolCard = ({ poolInfo, chain, walletAddress, handleVisible }) => {
  const { library } = useWeb3React();

  const [open, setOpen] = useState(false);
  const [amountIn, setAmountIn] = useState("0");
  const [amountOut, setAmountOut] = useState("0");
  const [stakers, setStakers] = useState(0);

  const chainsName = {
    56: "smartchain",
    43114: "avalanchec",
  };

  useEffect(() => {
    async function getPool() {
      const info = await spool(chain, poolInfo.address).getStakerCount();
      console.log("--------", info);
      setStakers(BigNumber.from(info).toNumber());
    }
    getPool();
  }, [walletAddress, poolInfo]);

  const stake = async (tokenAddress, poolAddress) => {
    try {
      const approveTx = await tokenWeb3(
        tokenAddress,
        library.getSigner()
      ).approve(poolAddress, parseEther(amountIn));
      await approveTx.wait();
      const tx = await spoolWeb3(poolAddress, library.getSigner()).stake(
        parseEther(amountIn)
      );
      await tx.wait();
      window.alert("staked");
    } catch (err) {
      console.log(err);
    }
  };

  const unstake = async (poolAddress) => {
    try {
      const tx = await spoolWeb3(poolAddress, library.getSigner()).unstake(
        parseEther(amountOut)
      );
      await tx.wait();
      window.alert("unstake");
    } catch (err) {
      console.log(err);
    }
  };

  const harvest = async (poolAddress) => {
    try {
      const tx = await spoolWeb3(poolAddress, library.getSigner()).harvest();
      await tx.wait();
      window.alert("harvest");
    } catch (err) {
      console.log(err);
    }
  };

  console.log("------------", poolInfo);

  return (
    poolInfo && (
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
          container
          spacing={2}
          sx={{
            cursor: "pointer",
            alignItems: "center",
          }}
          onClick={() => setOpen(true)}
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
                    chainsName[poolInfo.chain]
                  }/assets/${poolInfo.stakeToken}/logo.png`}
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
                    chainsName[poolInfo.chain]
                  }/assets/${poolInfo.rewardToken}/logo.png`}
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
                  {`${poolInfo.name.toUpperCase()}`}
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
                    chainsName[poolInfo.chain]
                  }/assets/${poolInfo.address}/logo.png`}
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
                  {`${poolInfo.rewardSymbol}`}
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
                  {`${poolInfo.apr.toFixed(3)}%`}
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
                    {moment(poolInfo.start).format("MMM DD YYYY")}
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
                  {moment(poolInfo.end).format("MMM DD YYYY")}
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
                  <Typography variant="h3" component="div">
                    {0}
                  </Typography>
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
                      {stakers}
                    </Typography>
                  </Hidden>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {open && (
          <Box
            sx={{
              background: "#020826",
              px: "30px",
              py: "10px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      size="small"
                      fullWidth
                      value={amountIn}
                      onChange={(e) => setAmountIn(e.target.value)}
                      label="Stake Amount"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      onClick={() =>
                        stake(poolInfo.rewardToken, poolInfo.address)
                      }
                      variant="contained"
                    >
                      Stake
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      size="small"
                      fullWidth
                      value={amountOut}
                      onChange={(e) => setAmountOut(e.target.value)}
                      label="Unstake Amount"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      onClick={() => unstake(poolInfo.address)}
                      variant="contained"
                    >
                      Unstake
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      onClick={() => harvest(poolInfo.address)}
                      variant="contained"
                    >
                      Harvest
                    </Button>
                  </Grid>
                  <Grid item xs={8}>
                    {(String(walletAddress).toLowerCase() === admin ||
                      String(walletAddress).toLowerCase() ===
                        poolInfo.owner.toLowerCase()) && (
                      <Box>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!poolInfo.invisible}
                              onChange={(e) =>
                                handleVisible(poolInfo._id, !e.target.checked)
                              }
                            />
                          }
                          label="show/hide"
                        />
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
      </Card>
    )
  );
};

export default PoolCard;
