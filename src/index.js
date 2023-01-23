import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// import { Provider } from 'react-redux';
import { theme } from "./style/theme";
import "./index.css";
// import store from './reducers/store';

import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
};

const myTheme = createTheme(theme);
myTheme.typography.h3 = {
  fontSize: "1.2rem",
  "@media (min-width:300px)": {
    fontSize: "12px",
    fontWeight: "normal",
  },
  [myTheme.breakpoints.up("md")]: {
    fontSize: "14px",
    fontWeight: "normal",
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={myTheme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <App />
      </Web3ReactProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
