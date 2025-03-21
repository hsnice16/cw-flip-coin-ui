/* eslint-disable @typescript-eslint/no-explicit-any */

import { getBalance } from "@/util/wallet";
import { useToasts } from "./ToastsContext";
import { EVM_DECIMALS } from "@/constant/value";
import { Contract } from "ethers";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { HistoryLog } from "@/types";
import { getHistoryLogs } from "@/util/contract";

export type AccountContextType = {
  account: string;
  showAccountInfo: boolean;
  setAccount: Dispatch<SetStateAction<string>>;
  setShowAccountInfo: Dispatch<SetStateAction<boolean>>;
  wallet: any;
  setWallet: Dispatch<SetStateAction<any>>;
  balance: string;
  contract: Contract | undefined;
  setContract: Dispatch<SetStateAction<Contract | undefined>>;
  fetchBalance: () => Promise<void>;
  history: HistoryLog[];
  setHistory: Dispatch<SetStateAction<HistoryLog[]>>;
  fetchHistory: () => Promise<void>;
};

const AccountContext = createContext<AccountContextType>({
  account: "",
  showAccountInfo: false,
  setAccount: () => {},
  setShowAccountInfo: () => {},
  wallet: null,
  setWallet: () => {},
  balance: "",
  contract: undefined,
  setContract: () => {},
  fetchBalance: async () => {},
  history: [],
  setHistory: () => {},
  fetchHistory: async () => {},
});

export default function AccountContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [account, setAccount] = useState("");
  const [wallet, setWallet] = useState<any>(null);
  const [showAccountInfo, setShowAccountInfo] = useState(false);

  const { setToast } = useToasts();
  const balanceIntervalIdRef = useRef<NodeJS.Timeout>(undefined);
  const [contract, setContract] = useState<Contract>();

  const [balance, setBalance] = useState("");
  const [history, setHistory] = useState<HistoryLog[]>([]);

  async function fetchHistory() {
    try {
      const historyLogs: HistoryLog[] = await getHistoryLogs(contract);
      setHistory(historyLogs.reverse());
    } catch (err) {
      setToast({
        msg: "Fetch History: " + (err as Error).message,
        type: "error",
      });
    }
  }

  async function fetchBalance() {
    if (wallet && account) {
      try {
        const hexBalance = await getBalance(wallet, account);

        const balance = Number(hexBalance) / 10 ** EVM_DECIMALS;
        setBalance(String(balance));
      } catch (err) {
        if (
          !(err as Error).message.toLowerCase().includes("is not valid json")
        ) {
          setToast({
            msg: "Balance: " + (err as Error).message,
            type: "error",
          });
        }
      }
    } else {
      setBalance("");
    }
  }

  useEffect(() => {
    fetchBalance();
    balanceIntervalIdRef.current = setInterval(fetchBalance, 2 * 1000); // fetch new balance every 2 seconds

    return () => clearInterval(balanceIntervalIdRef.current);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, account, contract]);

  const value = {
    account,
    showAccountInfo,
    setAccount,
    setShowAccountInfo,
    wallet,
    setWallet,
    balance,
    contract,
    setContract,
    fetchBalance,
    history,
    setHistory,
    fetchHistory,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  return useContext(AccountContext);
}
