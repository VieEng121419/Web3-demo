import { useReadContract, useWriteContract } from "wagmi";
import { formatUnits, erc20Abi, parseUnits } from "viem";

const TOKENS = {
  BUSD: {
    address: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
    symbol: "BUSD",
    decimals: 18,
  },
};

export function useERC20Transfer({ recipient, amount, address }) {
  const { data: rawBalance } = useReadContract({
    address: TOKENS.BUSD.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });

  console.log("rawBalance", rawBalance);

  const formattedBalance = rawBalance
    ? formatUnits(rawBalance, TOKENS.BUSD.decimals)
    : "0";

  const { writeAsync: transfer } = useWriteContract({
    address: TOKENS.BUSD.address,
    abi: erc20Abi,
    functionName: "transfer",
  });

  const sendToken = async () => {
    if (!amount || !recipient) return;
    const parsedAmount = parseUnits(amount, 18);
    return transfer({ args: [recipient, parsedAmount] });
  };

  return {
    sendToken,
    balance: {
      formatted: formattedBalance,
      symbol: "BUSD",
    },
  };
}
