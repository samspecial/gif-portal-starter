import { useState, useEffect } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import Form from "./components/Form";

// Constants
const TWITTER_HANDLE = "samuelosinloye";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  "https://media.giphy.com/media/k481R5ERN7jJm/giphy.gif",
  "https://media.giphy.com/media/l1J9BSsgrLzeRET6w/giphy.gif",
  "https://media2.giphy.com/media/l0Iyo62D7qCPHKvxC/200.webp?cid=ecf05e47kvdzuyof18lp5fflfjix11p0dfbvtrr43bjogh3b&rid=200.webp&ct=g",
  "https://media.giphy.com/media/9BdxKdIOsxATC/giphy.gif",
  "https://media.giphy.com/media/ocXjZoA4Eg6D01QA3r/giphy.gif",
  "https://media.giphy.com/media/AF1OSGq0jd7oeaN8t2/giphy.gif",
  "https://media.giphy.com/media/3o6vXWMK8xYuzOXwJO/giphy.gif",
  "https://media.giphy.com/media/OZrPXapZq0EcU/giphy.gif",
  "https://media.giphy.com/media/LI7DRrJeN0dIk/giphy.gif",
  "https://media.giphy.com/media/ibjzmmQo9RuHOR6IGN/giphy.gif",
  "https://media.giphy.com/media/a0QJ4PfN5Fbry/giphy.gif",
  "https://media.giphy.com/media/yrvffEW2hbRU8ldDjV/giphy.gif",
  "https://media.giphy.com/media/3orieNjYWHxLMDkomY/giphy.gif",
  "https://media.giphy.com/media/3oriNR564J11d4V5OU/giphy.gif",
  "https://media.giphy.com/media/KPaJ8b9Ztkty0/giphy.gif",
  "https://media.giphy.com/media/3ornjM1ow4vbrifDAA/giphy.gif",
];

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
      setGifList(TEST_GIFS);
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
}) => {
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
};
export default App;
