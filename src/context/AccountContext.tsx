/* eslint-disable @typescript-eslint/no-explicit-any */

import { getBalance } from "@/util/wallet";
import { useToasts } from "./ToastsContext";
import { Contract } from "ethers";
import { DEFAULT_HISTORY_LOG_LIMIT, EVM_DECIMALS } from "@/constant/value";

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

import { HistoryLog, LastBet } from "@/types";
import { getEvmAddress, getHistoryLogs } from "@/util/contract";

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
  addrContract: Contract | undefined;
  setAddrContract: Dispatch<SetStateAction<Contract | undefined>>;
  fetchBalance: () => Promise<void>;
  history: HistoryLog[];
  setHistory: Dispatch<SetStateAction<HistoryLog[]>>;
  fetchHistory: () => Promise<void>;
  lastBet: LastBet;
  setLastBet: Dispatch<SetStateAction<LastBet>>;
  flipStatus: string;
  setFlipStatus: Dispatch<SetStateAction<string>>;
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
  addrContract: undefined,
  setAddrContract: () => {},
  fetchBalance: async () => {},
  history: [],
  setHistory: () => {},
  fetchHistory: async () => {},
  lastBet: { wager: 0, did_win: false, player: "", flip_id: "" },
  setLastBet: () => {},
  flipStatus: "",
  setFlipStatus: () => {},
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
  const [addrContract, setAddrContract] = useState<Contract>();

  const [balance, setBalance] = useState("");
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const offsetRef = useRef(0);

  const [flipStatus, setFlipStatus] = useState("");
  const [lastBet, setLastBet] = useState<LastBet>({
    wager: 0,
    did_win: false,
    player: "",
    flip_id: "",
  });

  // Fetch History Function
  async function fetchHistory() {
    try {
      const historyLogs: HistoryLog[] = await getHistoryLogs(
        contract,
        offsetRef.current
      );

      const promises = await Promise.allSettled(
        historyLogs.map(async (historyLog) => {
          const evmAddress = await getEvmAddress(
            addrContract,
            historyLog.user_address
          );

          return { ...historyLog, user_address: evmAddress };
        })
      );

      // Filter Settled Logs
      const settledLogs = promises.reduce((acc: HistoryLog[], curr) => {
        if (curr.status === "fulfilled") {
          return [...acc, curr.value];
        }

        return acc;
      }, []);

      // SetHistory
      setHistory((prev) => {
        return [...prev, ...settledLogs];
      });

      if (settledLogs.length === DEFAULT_HISTORY_LOG_LIMIT) {
        offsetRef.current += DEFAULT_HISTORY_LOG_LIMIT;
        await fetchHistory();
      }

      if (!lastBet.player) {
        const history = settledLogs[settledLogs.length - 1];

        if (history) {
          // Initialize Last Bet
          setLastBet({
            wager: history.wager ?? 0,
            did_win: history.did_win ?? false,
            player: history.user_address,
            flip_id: history.flip_id,
          });
        }
      }
    } catch (err) {
      setToast({
        msg: "Fetch History: " + (err as Error).message,
        type: "error",
      });
    }
  }

  // Fetch Balance Function
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

  // UseEffect to Fetch Balance in an Interval of 2 seconds
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
    addrContract,
    setAddrContract,
    fetchBalance,
    history,
    setHistory,
    fetchHistory,
    lastBet,
    setLastBet,
    flipStatus,
    setFlipStatus,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  return useContext(AccountContext);
}
