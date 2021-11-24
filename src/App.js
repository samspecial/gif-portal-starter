import { useState, useEffect } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constants
const TWITTER_HANDLE = "samuelosinloye";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);

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

  const disconnectWallet = async () => {
    const { solana } = window;

    await solana.disconnect();
    setWalletAddress(null);
    console.log("Solana successfully disconnected");
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkWalletIsConected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App">
      <div className={walletAddress ? "auth-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨🕊
          </p>

          {
            <RenderNotConnectedContainer
              connectButton={!walletAddress ? connectWallet : disconnectWallet}
              walletAddress={walletAddress}
            ></RenderNotConnectedContainer>
          }
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

export default App;
