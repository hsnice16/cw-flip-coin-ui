/* eslint-disable @typescript-eslint/no-explicit-any */
import { getBalance } from "@/util/wallet";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useToasts } from "./ToastsContext";
import { EVM_DECIMALS } from "@/constant/value";

export type AccountContextType = {
  account: string;
  showAccountInfo: boolean;
  setAccount: Dispatch<SetStateAction<string>>;
  setShowAccountInfo: Dispatch<SetStateAction<boolean>>;
  wallet: any;
  setWallet: Dispatch<SetStateAction<any>>;
  balance: string;
};

const AccountContext = createContext<AccountContextType>({
  account: "",
  showAccountInfo: false,
  setAccount: () => {},
  setShowAccountInfo: () => {},
  wallet: null,
  setWallet: () => {},
  balance: "",
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
  const [balance, setBalance] = useState("");

  useEffect(() => {
    (async function fetchBalance() {
      if (wallet && account) {
        try {
          const hexBalance = await getBalance(wallet, account);

          const balance = Number(hexBalance) / 10 ** EVM_DECIMALS;
          setBalance(String(balance));
        } catch (err) {
          setToast({
            msg: "Balance: " + (err as Error).message,
            type: "error",
          });
        }
      } else {
        setBalance("");
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, account]);

  const value = {
    account,
    showAccountInfo,
    setAccount,
    setShowAccountInfo,
    wallet,
    setWallet,
    balance,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  return useContext(AccountContext);
}
