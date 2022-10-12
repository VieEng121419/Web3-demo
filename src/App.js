import "./index.css";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Web3 = require("web3");

const networks = {
  bsc: {
    chainId: `0x${Number(97).toString(16)}`,
    chainName: "Binance Smart Chain Testnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18
    },
    rpcUrls: [
      "https://data-seed-prebsc-1-s1.binance.org:8545/",
      "https://data-seed-prebsc-1-s2.binance.org:8545/",
      "https://data-seed-prebsc-1-s3.binance.org:8545/",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed2.defibit.io",
      "https://bsc-dataseed3.defibit.io",
      "https://bsc-dataseed4.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed2.ninicoin.io",
      "https://bsc-dataseed3.ninicoin.io",
      "https://bsc-dataseed4.ninicoin.io",
      "wss://bsc-ws-node.nariox.org"
    ],
    blockExplorerUrls: ["https://testnet.bscscan.com"]
  }
};

export default function App() {
    const toastConnect = () => toast.success("Connected!");
    const toastFail = () => toast.error("Please install Metamask extension!");
    const toastDisconnect = () => toast.error("Disconnected");
    const [walletAddress, setWalletAddress] = useState("");
    const [balance, setBalance] = useState("");
    const [loadingAddress, setLoadingAddress] = useState(false);

    const changeNetwork = async ({ networkName, setError }) => {
      try {
        if (!window.ethereum) throw new Error("No crypto wallet found");
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...networks[networkName]
            }
          ]
        });
      } catch (err) {
        console.log(err.message);
      }
    };

    const handleNetworkSwitch = async (networkName) => {
      await changeNetwork({ networkName });
    };

    async function requestAccount() {
        setLoadingAddress(true);
        const web3 = new Web3(Web3.givenProvider);
        if (web3) {
            try {
                await handleNetworkSwitch("bsc")
                const accounts = await web3.eth.requestAccounts();
                const balance = await web3.eth.getBalance(accounts[0]);
                setWalletAddress(accounts[0]);
                setBalance(balance);
                toastConnect();
            } catch (error) {
                console.log("Error connecting...", error);
                toastFail();
            } finally {
                setLoadingAddress(false);
            }
        } else {
            alert("Cannot Detect Wallet");
            console.log("Not detected");
            setLoadingAddress(false);
        }
    }

    function disconnectAccount() {
        setWalletAddress("");
        toastDisconnect();
    }

    return (
        <div className="wrapper" style={{ width: "100%", height: "100vh" }}>
            <div className="center-absolute max-h-screen">
                <div className="card max-w-lg mx-auto p-8 relative block rounded-xl border border-gray-100 p-8 shadow-xl hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring">
                    <h1 className="mb-4 text-2xl font-bold text-gray-900 text-left">
                        {walletAddress ? "Connected" : "Connect to a wallet"}
                    </h1>
                    {walletAddress ? (
                        <>
                            <p className="mt-4 text-gray-600">
                                <h6 className="mt-2 font-bold">Address:</h6>
                                {walletAddress}
                            </p>
                            <p className="mt-4 mb-4 text-gray-600">
                                <h6 className="mt-2 font-bold">Balance:</h6>
                                {balance}
                            </p>
                        </>
                    ) : null}
                    <div className="flex justify-center items-center">
                        <button
                            className="flex items-center justify-center w-full rounded-xl border-4 border-black bg-pink-100 px-8 py-4 font-bold shadow-[6px_6px_0_0_#000] transition hover:shadow-none focus:outline-none focus:ring active:bg-pink-50"
                            onClick={
                                walletAddress
                                    ? disconnectAccount
                                    : requestAccount
                            }
                        >
                            {loadingAddress ? (
                                <div
                                    className="flex justify-between items-center gap-5"
                                    role="status"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                    <span className="">Waiting...</span>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center gap-5">
                                    {walletAddress
                                        ? "Disconnect"
                                        : "Connect Metamask"}
                                    {walletAddress ? null : (
                                        <img
                                            alt="icon-metemask"
                                            width={25}
                                            height={25}
                                            src="https://cdn.cdnlogo.com/logos/m/79/metamask.svg"
                                        />
                                    )}
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}
