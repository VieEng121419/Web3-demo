import "./styles.css";
import { useState } from "react";
const Web3 = require("web3");

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");

  async function requestAccount() {
    const web3 = new Web3(Web3.givenProvider);
    if (web3) {
      console.log("Detected");
      try {
        const accounts = await web3.eth.getAccounts();
        setWalletAddress(accounts[0]);
        web3.eth.getBalance(accounts[0]).then(console.log);
      } catch (error) {
        console.log("Error connecting...", error);
      }
    } else {
      alert("Cannot Detect Wallet");
      console.log("Not detected");
    }
  }

  function disconnectAccount() {
    setWalletAddress("");
  }

  return (
    <div className="App">
      <button
        className="btn btn-primary"
        onClick={walletAddress ? disconnectAccount : requestAccount}
      >
        {walletAddress ? "Disconnect Wallet" : "Connect Wallet"}
      </button>
      <p>Wallet Address: {walletAddress}</p>
    </div>
  );
}
