import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { toast } from "react-toastify";
import { bscTestnet } from "viem/chains";
import { metaMask } from "wagmi/connectors";
import { Dropdown, DropdownItem } from "flowbite-react";

const people = [
  { id: 1, name: "Durward Reynolds", unavailable: fal499se },
  { id: 2, name: "Kenton Towne", unavailable: false },
  { id: 3, name: "Therese Wunsch", unavailable: false },
  { id: 4, name: "Benedict Kessler", unavailable: true },
  { id: 5, name: "Katelyn Rohan", unavailable: false },
];

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    onSuccess: () => toast.success("Connected!"),
    onError: () => toast.error("Please install Metamask extension!"),
  });
  const { disconnect } = useDisconnect({
    onSuccess: () => toast.error("Disconnected"),
  });
  const [selectedPerson, setSelectedPerson] = useState(people[0]);
  const { data: balance } = useBalance({
    address,
    chainId: bscTestnet.id,
    watch: true,
  });

  return (
    <>
      <div className="flex flex-row gap-5">
        <div className="flex flex-row gap-5 justify-between items-center rounded-2xl border border-gray-100 shadow-sm bg-white px-5 py-3">
          <Dropdown label="Dropdown button">
            <DropdownItem>Dashboard</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Earnings</DropdownItem>
            <DropdownItem>Sign out</DropdownItem>
          </Dropdown>
        </div>
        {isConnected && (
          <div className="flex flex-row gap-5 justify-between items-center rounded-2xl border border-gray-100 shadow-sm bg-white px-5 py-3">
            <p className="font-semibold">
              {balance?.formatted} {balance?.symbol}
            </p>
            <p className="font-semibold">{address}</p>
          </div>
        )}
      </div>
      <div className="card max-w-lg mx-auto p-8 mt-3 relative block rounded-2xl border border-gray-100 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 text-left">
          {isConnected ? "Connected" : "Connect to a wallet"}
        </h1>
        {isConnected ? (
          <>
            <p className="mt-4 text-gray-600">
              <h6 className="mt-2 font-bold">Address:</h6>
              {address}
            </p>
            <p className="mt-4 mb-4 text-gray-600">
              <h6 className="mt-2 font-bold">Balance:</h6>
              {balance?.formatted} {balance?.symbol}
            </p>
          </>
        ) : null}
        <div className="flex justify-center items-center">
          <button
            className="flex items-center justify-center w-full rounded-xl border-4 border-black bg-pink-100 px-8 py-4 font-bold shadow-[6px_6px_0_0_#000] transition hover:shadow-none focus:outline-none focus:ring active:bg-pink-50"
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
