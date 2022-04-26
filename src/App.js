/*
 *  Entry-point for the FuBuFi frontend.
 */

import React, { useState, useCallback, useEffect } from "react";
import { NavLink } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import Web3 from "web3";

import MainLayout from "./pages/MainLayout.js";
import {Footer} from "./components/Footer.js";

import { injected } from './components/Connectors.ts';
import { useWeb3React } from "@web3-react/core";

import { useEagerConnect, useInactiveListener } from "./components/Hooks.ts";

////////////////////////////////////////////////////////////////////////////////

import "./App.css";
import { getNetwork } from "@ethersproject/networks";

////////////////////////////////////////////////////////////////////////////////

const toBN = Web3.utils.toBN;

////////////////////////////////////////////////////////////////////////////////

const prettyfyAddress = (acct, size) => {
  if (!acct) return "INVALID";
  const s = acct.substring(0, 2+size);
  const e = acct.substring(acct.length-4, acct.length);
  return s + "..." + e;
}

////////////////////////////////////////////////////////////////////////////////

const App = (props) => {
  const context = useWeb3React();
  const { connector, chainId, account, activate, active, error } = context;

  const network = getNetwork(chainId);
  const networkName = (network && network.name) || "unknown";
  const prettyAddress = prettyfyAddress(account, 4);

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);
  const [contractsLoaded, setContractsLoaded] = useState(false);
  const [numBatches, setNumBatches] = useState(0);

  const [bottle, setBottleContract] = useState(undefined);
  const [bottleWrapper, setBottleWrapperContract] = useState(undefined);

  // If the chain changes, update the UI by taking over the contractsLoaded boolean.
  useEffect(() => {
    setContractsLoaded(false);
  }, [chainId])

  // If the chain changes, update all the contract ABIs.
  useEffect(() => {
    async function setupContracts() {
      const contract = require("@truffle/contract");

      // let BottleABI = contract(_Bottle);
      // let BottleWrapperABI = contract(_BottleWrapper);

      // BottleABI.setProvider(window.web3.currentProvider);
      // BottleWrapperABI.setProvider(window.web3.currentProvider);

      // const cBottle = await BottleABI.deployed();
      // const cBottleWrapper = await BottleWrapperABI.deployed();

      // setBottleContract(cBottle);
      // setBottleWrapperContract(cBottleWrapper);
      setContractsLoaded(true);
    }
    setupContracts();
  }, [chainId, setBottleWrapperContract, setBottleContract, setContractsLoaded]);

  // If the chian or the user or the contracts change, update the balances and
  // the scene data.
  useEffect(() => {
    if (!(bottle && account)) return;

    const setupBalances = async () => {
      setNumBatches(await bottle.batchCount());
    }

    bottle.allEvents()
      .on("data", (e) => {
        console.log(e);
      })
      .on("error", (err) => {
        console.log("error", err);
      });

    setupBalances()
      .catch(console.error);

  }, [account, bottle, chainId, setNumBatches])

  // Callback to force wallet connection.
  const connectInjectedWallet = useCallback(() => {
    setActivatingConnector(injected)
    activate(injected);
  }, [setActivatingConnector, activate]);

  // Activating - the wallet is attempting to open.
  const activating = injected === activatingConnector;

  // Connected - the account is connected.
  const connected = injected === connector;
  const appStatus = !connected ? "not connected" : (networkName+" : "+prettyAddress);

  ////////////////////////////////////////////////////////////////////////////
  return (
    <div className="App">

      <div className="App-header">
        <NavLink exact activeClassName="isActive" to="/" data-tip data-for="networkInfoTooltip">
          FubuFi
        </NavLink>
        {/* <NavLink exact activeClassName="isActive" to="/about">FAQ</NavLink> */}
        <div className="grow"></div>
        <ReactTooltip id="networkInfoTooltip" arrowColor="var(--color-font)" place="bottom">
          <p>{appStatus}</p>
        </ReactTooltip>
      </div>

      <div className="App-body">
        <div className="App-scroll">
          <div style={{flexGrow: 1}}>
            <MainLayout
              connectWallet={connectInjectedWallet}
              connected={connected} activating={activating} active={active}
              numBatches={numBatches} contractsLoaded={contractsLoaded}
              user={account} chainId={chainId}
              bottle={bottle} bottleWrapper={bottleWrapper}
              error={error}
            />
          </div>
          {/* <Footer style={{marginBottom: "5px"}}/> */}
        </div>
      </div>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////

export default App;

////////////////////////////////////////////////////////////////////////////////
