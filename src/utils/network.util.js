export const networks = {
  4: {
    chainId: `0x${parseInt(4, 10).toString(16)}`,
    chainName: 'Rinkeby',
    nativeCurrency: {
      name: 'Ethereum Coin',
      symbol: 'Ether',
      decimals: 18,
    },
    rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: [''],
  },
  56: {
    chainId: `0x${parseInt(56, 10).toString(16)}`,
    chainName: 'Binance',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  97: {
    chainId: `0x${parseInt(97, 10).toString(16)}`,
    chainName: 'BSC Testnet',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  },
  128: {
    chainId: `0x${parseInt(128, 10).toString(16)}`,
    chainName: 'HECO Mainnet',
    nativeCurrency: {
      name: 'Huobi Token',
      symbol: 'HT',
      decimals: 18,
    },
    rpcUrls: ['https://http-mainnet.hecochain.com'],
    blockExplorerUrls: ['https://hecoinfo.com/'],
  },
  43113: {
    chainId: `0x${parseInt(43114, 10).toString(16)}`,
    chainName: 'Avalanche Fuji Testnet',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://cchain.explorer.avax.network/'],
  },
  43114: {
    chainId: `0x${parseInt(43114, 10).toString(16)}`,
    chainName: 'Avalanche',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://cchain.explorer.avax.network/'],
  },
  137: {
    chainId: `0x${parseInt(137, 10).toString(16)}`,
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
    blockExplorerUrls: ['https://explorer.matic.network/'],
  },
  250: {
    chainId: `0x${parseInt(250, 10).toString(16)}`,
    chainName: 'Fantom Opera',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ftm.tools'],
    blockExplorerUrls: ['https://ftmscan.com/'],
  },
  4002: {
    chainId: '0xfa2',
    chainName: 'Fantom testnet',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.testnet.fantom.network/'],
    blockExplorerUrls: ['https://ftmscan.com/'],
  },
};


export const scanSites = {
  "ftm": "https://ftmscan.com/",
  "bsctest": "https://testnet.bscscan.com/"
}
let currentNetwork = null;
if (process.env.NODE_ENV === 'development') {
  currentNetwork = networks[97];
} else {
  currentNetwork = networks[97];
}


export const addNet = {
  "id": 1,
  "jsonrpc": "2.0",
  "method": "wallet_addEthereumChain",
  "params": [currentNetwork]
};
export const switchNet = {
  "id": 1,
  "jsonrpc": "2.0",
  "method": "wallet_switchEthereumChain",
  "params": [{
    chainId: currentNetwork.chainId
  }]
}

