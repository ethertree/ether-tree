import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { Row, Col, Button, Menu } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import {
  useExchangePrice,
  useGasPrice,
  useUserProvider,
  useContractLoader,
  useContractReader,
  useEventListener,
  useBalance,
  useExternalContractLoader,
} from "./hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge } from "./components";
import { Transactor } from "./helpers";
import { formatEther, parseEther } from "@ethersproject/units";
//import Hints from "./Hints";
import { Hints, ExampleUI, Subgraph, PlantTree, Trees, About, HowTo, MyTree, Faqs } from "./views";
import tryToDisplay from "./components/Contract/utils";

/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    📡 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/
import { INFURA_ID, DAI_ADDRESS, DAI_ABI } from "./constants";

// 😬 Sorry for all the console logging 🤡
const DEBUG = true;

// 🔭 block explorer URL
const blockExplorer = "https://kovan.etherscan.io/"; // for xdai: "https://blockscout.com/poa/xdai/"

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
//const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)
console.log("window.location.hostname", window.location.hostname);
// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = "http://" + window.location.hostname + ":8545"; // for xdai: https://dai.poa.network
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);

function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 this hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(mainnetProvider); //1 for xdai

  /* 🔥 this hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice("fast"); //1000000000 for xdai

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  if (DEBUG) console.log("💵 yourLocalBalance", yourLocalBalance ? formatEther(yourLocalBalance) : "...");

  // just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);
  if (DEBUG) console.log("💵 yourMainnetBalance", yourMainnetBalance ? formatEther(yourMainnetBalance) : "...");

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider);
  if (DEBUG) console.log("📝 readContracts", readContracts);

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider);
  if (DEBUG) console.log("🔐 writeContracts", writeContracts);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  //const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI)
  //console.log("🥇DAI contract on mainnet:",mainnetDAIContract)
  //
  // Then read your DAI balance like:
  //const myMainnetBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])
  //

  // keep track of a variable from the contract in the local React state:
  // const purpose = useContractReader(readContracts,"YourContract", "purpose")
  // console.log("🤗 purpose:",purpose)

  const treeCount = tryToDisplay(useContractReader(readContracts, "Arboretum", "treeCount"));
  console.log("treeCount : ", treeCount);

  //📟 Listen for broadcast events
  // const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);
  // console.log("📟 SetPurpose events:", setPurposeEvents);

  // const treePlantedEvents = useEventListener(readContracts, "Arboretum", "TreePlanted", localProvider, 1);
  // console.log("Tree planted events:", treePlantedEvents);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  


  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />

      <BrowserRouter>
        <Menu style={{ textAlign: "center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute("/");
              }}
              to="/"
            >
              YourContract
            </Link>
          </Menu.Item>
          <Menu.Item key="/plant">
            <Link
              onClick={() => {
                setRoute("/plant");
              }}
              to="/plant"
            >
              Plant A Tree
            </Link>
          </Menu.Item>
          <Menu.Item key="/my-tree">
            <Link
              onClick={() => {
                setRoute("/my-tree");
              }}
              to="/my-tree"
            >
              My Trees
            </Link>
          </Menu.Item>
          <Menu.Item key="/tree">
            <Link
              onClick={() => {
                setRoute("/tree");
              }}
              to="/tree"
            >
              Forest
            </Link>
          </Menu.Item>
          <Menu.Item key="/how-to">
            <Link
              onClick={() => {
                setRoute("/how-to");
              }}
              to="/how-to"
            >
              How To Play
            </Link>
          </Menu.Item>
          <Menu.Item key="/about">
            <Link
              onClick={() => {
                setRoute("/about");
              }}
              to="/about"
            >
              About Us
            </Link>
          </Menu.Item>
          <Menu.Item key="/faq">
            <Link
              onClick={() => {
                setRoute("/faq");
              }}
              to="/faq"
            >
              FAQ
            </Link>
          </Menu.Item>
        </Menu>

        <Switch>
          <Route exact path="/">
            <Contract
              name="Arboretum"
              signer={userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
          </Route>      
          <Route path="/how-to">
            <HowTo />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/faq">
            <Faqs />
          </Route>
          <Route path="/my-tree">
            <MyTree />
          </Route>
          <Route path="/tree">
            <Trees
              address={address}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              localProvider={localProvider}
              yourLocalBalance={yourLocalBalance}
              price={price}
              tx={tx}
              writeContracts={writeContracts}
              readContracts={readContracts}
              treeCount={treeCount}
            />
          </Route>
          <Route path="/plant">
            <PlantTree
              address={address}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              localProvider={localProvider}
              yourLocalBalance={yourLocalBalance}
              price={price}
              tx={tx}
              writeContracts={writeContracts}
              readContracts={readContracts}
              purpose={"he"}
              treeCount={treeCount}
            />
          </Route>
        </Switch>
      </BrowserRouter>

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={localProvider}
          userProvider={userProvider}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />        
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
    </div>
  );
}

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

export default App;
