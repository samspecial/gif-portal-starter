import { useState, useEffect } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import Form from "./components/Form";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "./idl.json";
import kp from "./keypair.json";

// 8aTD2oktQ3abJr91FAW1fvYWbB8BeVLz5CWtXpuRU2Z

const { SystemProgram } = web3;
//get keypair
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

const programID = new PublicKey(idl.metadata.address);
// Set our network to devnet.
const network = clusterApiUrl("devnet");

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed",
};

// Constants
const TWITTER_HANDLE = "samuelosinloye";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  const checkWalletIsConected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!!");
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Solana with public key: ",
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        console.log("Solana object not found, get a phantom wallet.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Connect button;

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
      console.log(
        "Save public key to phantom: ",
        response.publicKey.toString()
      );
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("ping");
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });
      console.log(
        "Created a new BaseAccount w/ address:",
        baseAccount.publicKey.toString()
      );
      await getGifList();
    } catch (error) {
      console.log("Error creating BaseAccount account:", error);
    }
  };

  const submitGIF = async (event) => {
    event.preventDefault();
    if (inputValue.length > 0) {
      gifList.push(inputValue);
      setInputValue("");
    } else console.log("No input, try again!");
  };

  const disconnectWallet = async () => {
    const { solana } = window;

    await solana.disconnect();
    setWalletAddress(null);
    console.log("Solana successfully disconnected");
  };

  const getGifList = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      console.log("Got the account", account);
      // console.log();
      setGifList(account.gifList);
    } catch (error) {
      console.log("Error in getGifList: ", error);
      setGifList(null);
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkWalletIsConected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching GIFs list");
      getGifList();
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? "auth-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 SPORT GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨🕊
          </p>

          <RenderNotConnectedContainer
            connectButton={!walletAddress ? connectWallet : disconnectWallet}
            walletAddress={walletAddress}
          ></RenderNotConnectedContainer>

          {walletAddress && (
            <RenderConnectedContainer
              inputValue={inputValue}
              onInputChange={onInputChange}
              submitGIF={submitGIF}
              gifList={gifList}
              createGifAccount={createGifAccount}
            />
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

const RenderNotConnectedContainer = ({ connectButton, walletAddress }) => {
  return (
    <button
      className="cta-button connect-wallet-button"
      onClick={() => connectButton()}
    >
      {!walletAddress ? "Connect to Wallet" : "Disconnect wallet"}
    </button>
  );
};

const RenderConnectedContainer = ({
  onInputChange,
  inputValue,
  submitGIF,
  gifList,
  createGifAccount,
}) => {
  if (gifList === null) {
    return (
      <div className="connected-container">
        <button
          className="cta-button submit-gif-button"
          onClick={createGifAccount}
        >
          Do One-Time Initialization For GIF Program Account
        </button>
      </div>
    );
  } else {
    return (
      <div className="connected-container">
        <Form
          submitGIF={submitGIF}
          inputChange={onInputChange}
          inputValue={inputValue}
        />
        <div className="gif-grid">
          {gifList.map((gif) => (
            <div className="gif-item" key={gif}>
              <img src={gif} alt={gif} />
            </div>
          ))}
        </div>
      </div>
    );
  }
};
export default App;
