import React, { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useSendTransaction,
} from "wagmi";
import { toast } from "react-toastify";
import { bscTestnet } from "viem/chains";
import { metaMask } from "wagmi/connectors";
import { formatUnits, parseEther } from "viem";
import { useERC20Transfer } from "./ERC20Handler";

const tokens = [
  {
    id: 1,
    name: "BNB",
    symbol: "BNB",
    unavailable: false,
    icon: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  },
  {
    id: 2,
    name: "ERC20",
    symbol: "BUSD",
    address: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
    unavailable: false,
    icon: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  },
];

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect({
    onSuccess: () => toast.success("Connected!"),
    onError: () => toast.error("Please install Metamask extension!"),
  });
  const { disconnect } = useDisconnect({
    onSuccess: () => toast.error("Disconnected"),
  });
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: balance } = useBalance({
    address,
    chainId: bscTestnet.id,
    token: selectedToken.name === "ERC20" ? selectedToken.address : undefined,
    watch: true,
  });

  const handleTokenSelect = (token) => {
    setSelectedToken(token);
    setIsDropdownOpen(false);
  };

  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [showSendForm, setShowSendForm] = useState(false);

  const { sendToken, decimals } = useERC20Transfer({
    tokenAddress: address,
    recipient,
    amount,
  });

  const { sendTransaction } = useSendTransaction({
    mutation: {
      onSuccess: () => {
        toast.success(
          `Successfully sent ${amount} ${selectedToken.symbol} to ${recipient}`
        );
        setShowSendForm(false);
        setAmount("");
        setRecipient("");
      },
      onError: () => {
        toast.error("Failed to send transaction");
      },
    },
    onError: (error) => {
      toast.error("Transaction failed: " + error.message);
    },
  });

  const handleSend = async () => {
    if (!amount || !recipient) {
      toast.error("Please enter amount and recipient address");
      return;
    }

    try {
      if (selectedToken.name === "ERC20") {
        await sendToken();
        toast.success(
          `Successfully sent ${amount} ${selectedToken.symbol} to ${recipient}`
        );
      } else {
        await sendTransaction({ to: recipient, value: parseEther(amount) });
      }
      // Reset form after successful transaction
      setAmount("");
      setRecipient("");
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("Transaction failed: " + error.message);
    }
  };

  const metaMask = connectors.find(
    (connector) => connector.name === "MetaMask"
  );

  if (!metaMask) return null;

  return (
    <>
      <div className="flex flex-row gap-5">
        {isConnected && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex flex-row gap-5 justify-between items-center rounded-2xl border border-gray-100 shadow-sm bg-white px-5 py-3 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <img
                  src={selectedToken.icon}
                  alt={selectedToken.name}
                  className="w-6 h-6 rounded-full"
                />
                <p className="font-semibold">{selectedToken.name}</p>
              </div>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-100 rounded-2xl shadow-lg z-10">
                {tokens.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => handleTokenSelect(token)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 ${
                      selectedToken.id === token.id ? "bg-gray-100" : ""
                    }`}
                  >
                    <img
                      src={token.icon}
                      alt={token.name}
                      className="w-6 h-6 rounded-full"
                    />
                    {token.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isConnected && (
          <div className="flex flex-row gap-5 justify-between items-center rounded-2xl border border-gray-100 shadow-sm bg-white px-5 py-3">
            <p className="font-semibold">
              {balance?.formatted} {balance?.symbol}
            </p>
            <p className="font-semibold max-w-[150px]">
              {address?.slice(0, 6)}...{address?.slice(-6)}
            </p>
          </div>
        )}
      </div>
      {/* {isConnected && showSendForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-3 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Send {selectedToken.symbol}</h2>
              <button
                onClick={() => setShowSendForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To:
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Recipient Address"
                  className="w-full p-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full p-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <img
                      src={selectedToken.icon}
                      alt={selectedToken.symbol}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="font-medium">{selectedToken.symbol}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSend}
                className="w-full bg-pink-100 text-black font-bold py-3 px-4 rounded-2xl border-4 border-black shadow-[6px_6px_0_0_#000] transition hover:shadow-none focus:outline-none focus:ring active:bg-pink-50"
              >
                Send Payment
              </button>
            </div>
          </div>
        </div>
      )} */}

      <div className="card max-w-lg mx-auto p-8 mt-3 relative block rounded-2xl border border-gray-100 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 text-left">
          {isConnected ? (
            <p>Send {selectedToken.symbol}</p>
          ) : (
            "Connect to a wallet"
          )}
        </h1>
        {isConnected ? (
          <>
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To:
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount:
                  </label>
                  <div className="relative">
                    <input
                      type="string"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full p-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 pr-[70px]"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <img
                        src={selectedToken.icon}
                        alt={selectedToken.symbol}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="font-medium">
                        {selectedToken.symbol}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
        <div className="flex justify-center items-center mt-6 gap-4">
          {isConnected && (
            <button
              onClick={handleSend}
              className="w-full bg-pink-100 text-black font-bold py-3 px-4 rounded-2xl border-4 border-black shadow-[6px_6px_0_0_#000] transition hover:shadow-none focus:outline-none focus:ring active:bg-pink-50"
            >
              Send Payment
            </button>
          )}
          <button
            className={`flex items-center justify-center w-full rounded-2xl border-4 border-black ${
              isConnected ? "bg-gray-300" : "bg-pink-100"
            } px-4 py-3 font-bold shadow-[6px_6px_0_0_#000] transition hover:shadow-none focus:outline-none focus:ring active:bg-pink-50`}
            onClick={() =>
              isConnected ? disconnect() : connect({ connector: metaMask })
            }
          >
            <div className="flex justify-between items-center gap-5">
              {isConnected ? "Disconnect" : "Connect Metamask"}
              {!isConnected && (
                <img
                  alt="icon-metemask"
                  width={25}
                  height={25}
                  src="https://cdn.cdnlogo.com/logos/m/79/metamask.svg"
                />
              )}
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
