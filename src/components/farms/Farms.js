import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import Typography from "@mui/material/Typography";
import RoundButton from "../common/RoundButton";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  FormControlLabel,
  Grid,
  Hidden,
  Menu,
  MenuItem,
  Switch,
  FormGroup,
  IconButton,
  Stack,
} from "@mui/material";
// import Pagination from '@mui/material/Pagination';
import Divider from "@mui/material/Divider";
import loading from "../../assets/loading.svg";

import CreateFarm from "./CreateFarm";
import {
  address,
  erc20Abi,
  factory,
  farm,
  generatorWeb3,
  pair,
  tokenContract,
  tokenWeb3,
} from "../../utils/ethers.util";
import { formatEther, parseEther } from "ethers/lib/utils";
import { ethers } from "ethers";
import FarmCard from "../common/FarmCard";
import StakeDlg from "../common/StakeDlg";
import FarmCardV3 from "../common/FarmCardV3";
import { useWeb3React } from "@web3-react/core";
import SearchInput from "../common/SearchInput";
import { farmService, pairService } from "../../services/api.service";
import SearchIcon from "@mui/icons-material/Search";

const Farms = ({
  walletAddress,
  chain,
  openWalletAlert,
  farms,
  farmsv3,
  pairs,
  setFarms,
}) => {
  const [openCreateFarm, setOpenCreateFarm] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState();
  const [isMyFarm, setIsMyFarm] = useState(false);
  const open = Boolean(anchorEl);
  const [filterFarm, setFilterFarm] = useState([]);
  const [filterFarmv3, setFilterFarmv3] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [liq, setLiq] = useState();

  const { library } = useWeb3React();

  console.log(farms);

  useEffect(() => {
    async function getLiq() {
      let temp = 0;
      farms.map(async (ifarm) => {
        const info = await farm(chain, ifarm.address).farmInfo();
        temp = info.farmableSupply.add(temp);
        setLiq(formatEther(temp));
      });
    }
    getLiq();
  }, [farms]);

  const handleVisible = async (id, invisible) => {
    await farmService.setVisible({
      id: id,
      invisible: invisible,
    });
    const index = farms.findIndex((item) => item._id === id);
    let temp = [...farms];
    temp[index].invisible = invisible;
    setFarms(temp);
  };

  const handleOpenCreateFarm = () => {
    if (!walletAddress) {
      openWalletAlert();
    } else {
      setOpenCreateFarm(true);
    }
  };

  const handleFilter = (filterValue) => {
    setFilter(filterValue);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!!searchKey) {
      const temp = farms.filter((pool) =>
        pool.name.toLowerCase().includes(searchKey.toLowerCase())
      );
      const tempv3 = farmsv3.filter((pool) =>
        pool.name.toLowerCase().includes(searchKey.toLowerCase())
      );
      setFilterFarm(temp);
      setFilterFarmv3(tempv3);
    } else {
      setFilterFarm(farms);
      setFilterFarmv3(farmsv3);
    }
  }, [searchKey]);

  useEffect(() => {
    if (isMyFarm) {
      const temp = farms.filter((farm) => Number(farm.balance) > 0);
      const tempv3 = farmsv3.filter((farm) => Number(farm.balance) > 0);
      setFilterFarm(temp);
      setFilterFarmv3(tempv3);
    } else {
      setFilterFarm(farms);
      setFilterFarmv3(farmsv3);
    }
  }, [isMyFarm, farms, farmsv3]);

  // sort
  useEffect(() => {
    if (filter === "apr") {
      farms.sort((a, b) => {
        if (a.blockReward < b.blockReward) {
          return -1;
        }
        if (a.blockReward > b.blockReward) {
          return 1;
        }
        return 0;
      });
      farmsv3.sort((a, b) => {
        if (a.blockReward < b.blockReward) {
          return -1;
        }
        if (a.blockReward > b.blockReward) {
          return 1;
        }
        return 0;
      });
    }
    if (filter === "liq") {
      farms.sort((a, b) => {
        if (a.supply < b.supply) {
          return -1;
        }
        if (a.supply > b.supply) {
          return 1;
        }
        return 0;
      });
      farmsv3.sort((a, b) => {
        if (a.supply < b.supply) {
          return -1;
        }
        if (a.supply > b.supply) {
          return 1;
        }
        return 0;
      });
    }
    if (filter === "alpha") {
      farms.sort((a, b) => {
        if (a.symbol < b.symbol) {
          return -1;
        }
        if (a.symbol > b.symbol) {
          return 1;
        }
        return 0;
      });
      farmsv3.sort((a, b) => {
        if (a.symbol < b.symbol) {
          return -1;
        }
        if (a.symbol > b.symbol) {
          return 1;
        }
        return 0;
      });
    }
  }, [filter]);

  const createFarm = async (
    farmToken,
    amountIn,
    lptoken,
    blockReward,
    startBlock,
    bonusEndBlock,
    bonus,
    lockPeriod,
    isV3,
    index
  ) => {
    console.log("farmToken: ", farmToken);
    console.log("amountIn: ", amountIn);
    console.log("lptoken: ", lptoken);
    console.log("blockReward: ", blockReward);
    console.log("startBlock: ", startBlock);
    console.log("bonusEndBlock: ", bonusEndBlock);
    console.log("bonus: ", bonus);
    console.log("lockPeriod: ", bonus);
    console.log("isV3: ", isV3);
    console.log("index: ", index);
    try {
      // const allowance = await tokenContract(chain, farmToken).allowance(walletAddress, address[chain][index]['generator']);
      // if (Number(allowance) < Number(parseEther(amountIn))) {
      const tx1 = await tokenWeb3(farmToken, library.getSigner()).approve(
        address[chain][index]["generator"],
        parseEther(amountIn)
      );
      await tx1.wait();
      // }
      console.log(lockPeriod);
      const tx = await generatorWeb3(
        chain,
        library.getSigner(),
        index
      ).createFarmV2(
        farmToken,
        parseEther(amountIn),
        lptoken,
        Number(blockReward),
        startBlock,
        bonusEndBlock,
        bonus,
        lockPeriod,
        false
      );
      await tx.wait();

      const rewardSymbol = await tokenContract(chain, farmToken).symbol();
      console.log("rewardSymbol: ", rewardSymbol);
      const token0 = await pair(chain, lptoken).token0();
      console.log("token0: ", token0);
      const token1 = await pair(chain, lptoken).token1();
      console.log("token1: ", token1);
      const symbol1 = await tokenContract(chain, token0).symbol();
      console.log("symbol1: ", symbol1);
      const symbol2 = await tokenContract(chain, token1).symbol();
      console.log("symbol2: ", symbol2);
      const lpsymbol = `${symbol1}-${symbol2}`;
      console.log("lpsymbol: ", lpsymbol);
      const length = await factory(chain, index).farmsLength();
      console.log("length: ", length);
      const farmAddress = await factory(chain, index).farmAtIndex(
        Number(length) - 1
      );
      console.log("farmAddress: ", farmAddress);
      const farminfo = await farm(chain, farmAddress).farmInfo();
      console.log("farminfo: ", farminfo);
      const res = await farmService.createFarm({
        name: lpsymbol,
        baseToken: rewardSymbol,
        symbol: lpsymbol,
        start: new Date(startBlock * 1000),
        end: new Date(farminfo.endBlock * 1000),
        supply: formatEther(farminfo.farmableSupply),
        blockReward: blockReward,
        address: farmAddress,
        lptoken: lptoken,
        rewardToken: farmToken,
        token0: token0,
        token1: token1,
        chain: chain,
        owner: walletAddress,
        invisible: false,
      });
      setFarms([...farms, res]);
      setOpenCreateFarm(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      sx={{
        p: "1%",
      }}
    >
      <StakeDlg
        onClose={() => setSelectedFarm()}
        farm={selectedFarm}
        chain={chain}
        walletAddress={walletAddress}
      />
      {/* create farm */}
      <CreateFarm
        pairs={pairs}
        chain={chain}
        open={openCreateFarm}
        onClose={() => setOpenCreateFarm(false)}
        create={createFarm}
        walletAddress={walletAddress}
      />
      {/* total farming liquidity */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              px: { xs: "10px", sm: "40px" },
              background: "#001126",
              py: "10px",
              borderRadius: "15px",
            }}
            flexDirection={{ sm: "row", xs: "column" }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Box display="flex" alignItems="center">
                <Typography
                  sx={{ mt: "7px" }}
                  variant="h6"
                  gutterBottom
                  component="h6"
                  textTransform={"capitalize"}
                >
                  Total farming liquidity
                </Typography>
                <Typography
                  sx={{ mx: "5px", mt: "10px" }}
                  variant="h5"
                  gutterBottom
                  component="h5"
                >
                  {!!liq ? (
                    `$${Math.trunc(liq)}`
                  ) : (
                    <Box>
                      <img
                        style={{ height: "24px", paddingLeft: "20px" }}
                        src={loading}
                      />
                    </Box>
                  )}
                </Typography>
              </Box>
              <FormGroup
                sx={{
                  mx: { sm: "10px" },
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={isMyFarm}
                      onChange={(e) => setIsMyFarm(e.target.checked)}
                    />
                  }
                  label="My Farms"
                />
              </FormGroup>
            </Box>
            <Box sx={{ flexGrow: 1 }}></Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Box position={"relative"}>
                <SearchInput
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder="Search by name, symbol"
                />
                <IconButton
                  sx={{ position: "absolute", top: "2px", right: "3px" }}
                >
                  <SearchIcon />
                </IconButton>
              </Box>
              <Box display="flex" alignItems="center">
                <RoundButton
                  onClick={handleOpenCreateFarm}
                  sx={{
                    color: "text.primary",
                    border: "1px solid white",
                  }}
                  variant="outlined"
                >
                  <Typography variant="h3" component="h3">
                    Create Farm
                  </Typography>
                </RoundButton>
                <RoundButton
                  sx={{
                    color: "text.primary",
                    border: "1px solid white",
                  }}
                  variant="outlined"
                  id="filter-button"
                  aria-controls={open ? "filter-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <MenuIcon />
                  {/* <ExpandMoreIcon /> */}
                </RoundButton>
                <Menu
                  id="filter-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => setAnchorEl(null)}
                  MenuListProps={{
                    "aria-labelledby": "filter-button",
                  }}
                >
                  <MenuItem>Filtered By</MenuItem>
                  <Divider />
                  <MenuItem onClick={() => handleFilter("apr")}>APR</MenuItem>
                  <MenuItem onClick={() => handleFilter("liq")}>
                    Liquidity
                  </MenuItem>
                  <MenuItem onClick={() => handleFilter("alpha")}>
                    Alphabetic
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        className="stackss11"
        sx={
          {
            // overflowX: 'auto'
          }
        }
      >
        <Box
          className="stackss"
          sx={
            {
              // minWidth: '620px'
            }
          }
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              px: "40px",
              background: "#001126",
              py: "10px",
              borderRadius: "15px",
              mt: "10px",
            }}
          >
            <Grid
              sx={{
                cursor: "pointer",
                alignItems: "center",
              }}
              container
              spacing={2}
            >
              <Grid item md={6} sm={7} xs={7}>
                <Grid container spacing={2}>
                  {/* <Hidden smDown>
                    <Grid item xs={2}>
                    </Grid>
                  </Hidden> */}
                  <Grid item md={4} sm={5} xs={5}>
                    <Typography variant="h3" component="h3">
                      Pool
                    </Typography>
                  </Grid>
                  {/* <Hidden smDown> */}
                  <Grid item md={4} sm={4} xs={4}>
                    <Typography
                      sx={{
                        ml: "-20px",
                        marginLeft: {
                          md: "0px",
                          sm: "0px",
                          xs: "5px",
                        },
                      }}
                      variant="h3"
                      component="h3"
                    >
                      Reward
                    </Typography>
                  </Grid>
                  {/* </Hidden> */}
                  <Grid item md={4} sm={3} xs={3}>
                    <Typography
                      sx={{
                        ml: "-10px",
                        marginLeft: {
                          md: "-5px",
                          sm: "5px",
                          xs: "5px",
                        },
                      }}
                      variant="h3"
                      component="h3"
                      className="asdasd"
                    >
                      APY
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={4} sm={3} xs={3}>
                <Grid container spacing={2}>
                  <Hidden smDown>
                    <Grid item xs={1}></Grid>
                    <Grid sx={{ pl: "10px" }} item xs={5}>
                      <Typography variant="h3" component="h3">
                        Start Date
                      </Typography>
                    </Grid>
                  </Hidden>
                  <Grid item xs={10} sm={5}>
                    <Typography
                      sx={{ pr: "6px", ml: "10px" }}
                      variant="h3"
                      component="h3"
                    >
                      End Date
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={2}>
                <Grid container spacing={2}>
                  <Grid item xs={10} sm={6}>
                    <Typography sx={{ ml: "20px" }} variant="h3" component="h3">
                      Liquidity
                    </Typography>
                  </Grid>
                  <Hidden smDown>
                    <Grid item xs={6}>
                      <Typography
                        sx={{ ml: "20px" }}
                        variant="h3"
                        component="h3"
                      >
                        Farmers
                      </Typography>
                    </Grid>
                  </Hidden>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          {/* farms */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                minHeight: "50vh",
                width: "100%",
              }}
            >
              {filterFarm.map((farm, i) => (
                <FarmCard
                  key={i}
                  setSelectedFarm={setSelectedFarm}
                  chain={chain}
                  farmInfo={farm}
                  handleVisible={handleVisible}
                  walletAddress={walletAddress}
                />
              ))}
              {filterFarmv3.map((farm, i) => (
                <FarmCardV3
                  key={i}
                  setSelectedFarm={setSelectedFarm}
                  chain={chain}
                  farmInfo={farm}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* <Pagination count={10} variant='outlined'/> */}
      </Box>
    </Box>
  );
};

export default Farms;
