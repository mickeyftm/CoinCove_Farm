import { Button, Dialog, List, ListItemButton, ListItemText, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { pair, tokenContract } from '../../utils/ethers.util';


const LptokenDlg = ({ onClose, open, pairs, setLpToken, chain }) => {
  const [lpname, setLpname] = useState('');
  const [filteredPairs, setFilteredPairs] = useState([]);
  const [importToken, setImportToken] = useState();
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    async function getLptoken () {
      if (lpname.substring(0, 2) === '0x' && lpname.length === 42) {
        setShowList();
        const token0 = await pair(chain, lpname).token0();
        const token1 = await pair(chain, lpname).token1();
        const symbol1 = await tokenContract(chain, token0).symbol();
        const symbol2 = await tokenContract(chain, token1).symbol();
        setImportToken({
          address: lpname,
          symbol1: symbol1,
          symbol2: symbol2,
        })
      } else {
        setShowList(true);
        const temp = pairs.filter(pair => pair.symbol1.toLowerCase().includes(lpname.toLowerCase()) || pair.symbol2.toLowerCase().includes(lpname.toLowerCase()));
        setFilteredPairs(temp);
      }
    }
    getLptoken();
  }, [lpname]);

  const handleLptoken = (lpair) => {
    setLpToken(lpair);
    onClose();
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <Box
        sx={{
          p: '20px',
          position: 'relative',
          minHeight: '400px',
          width: '290px',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'fixed',
            width: '250px'
          }}
        >
          <TextField placeholder='Input name or address' value={lpname} onChange={e => setLpname(e.target.value)} size='small' fullWidth />
        </Box>
        <Box
          sx={{
            maxHeight: '500px',
            overflowY: 'auto',
            position: 'absolute',
            top: '90px',
            width: '100%'
          }}
        >
          <List>
            {
              showList && filteredPairs.map((lpair, i) => (
                <ListItemButton onClick={() => handleLptoken(lpair)} key={i}>
                  <ListItemText>
                    {lpair.symbol1} / {lpair.symbol2}
                  </ListItemText>
                </ListItemButton>
              ))
            }
          </List>
          {
            !showList && !!importToken ? (
              <Box
                sx={{
                  display: 'flex',
                  width: '250px',
                  alignItems: 'center'
                }}
              >
                <Box>
                  {`${importToken.symbol1}/${importToken.symbol2}`}
                </Box>
                <Box sx={{flexGrow: 1}}></Box>
                <Box>
                  <Button onClick={() => {setLpToken(importToken);onClose()}} variant='contained'>import</Button>
                </Box>
              </Box>
            ) : (
              <Box>Loading....</Box>
            )
          }
        </Box>
      </Box>
    </Dialog>
  );
}

export default LptokenDlg;