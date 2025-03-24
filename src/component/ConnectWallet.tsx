"use client";

import { TESTNET_CHAIN_ID } from "@/constant/value";
import { useToasts } from "@/context/ToastsContext";
import { useState } from "react";
import { useAccount } from "@/context/AccountContext";
import { BrowserProvider } from "ethers";

import {
  getAccount,
  getWalletChainId,
  getWalletName,
  requestPermission,
  revokePermission,
  switchToSeiTestnet,
} from "@/util/wallet";

import {
  getAddressPrecompileEthersV6Contract,
  getWasmPrecompileEthersV6Contract,
} from "@sei-js/evm";

export default function ConnectWallet() {
  const { setToast } = useToasts();
  const [isCopied, setIsCopied] = useState(false);

  const {
    setAccount,
    setShowAccountInfo,
    account,
    showAccountInfo,
    wallet: _wallet,
    setWallet,
    setContract,
    setAddrContract,
  } = useAccount();

  const handleConnectWallet = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const wallet = _wallet ?? window.compassEvm;

    if (wallet) {
      try {
        setWallet(wallet);
        const chainId = await getWalletChainId(wallet);

        if (chainId !== TESTNET_CHAIN_ID) {
          await switchToSeiTestnet(wallet);
        }

        await requestPermission(wallet);

        const account = await getAccount(wallet);
        setAccount(account);

        const provider = new BrowserProvider(wallet);
        const signer = await provider.getSigner();

        const contract = getWasmPrecompileEthersV6Contract(signer);
        setContract(contract);

        const addrContract = getAddressPrecompileEthersV6Contract(signer);
        setAddrContract(addrContract);
      } catch (err) {
        setToast({
          msg: (err as Error).message,
          type: "error",
        });
      }
    } else {
      setToast({
        msg: "Compass Wallet is not installed in the browser",
        type: "info",
      });
    }
  };

  const handleCopyClick = () => {
    setIsCopied(true);
    window.navigator.clipboard.writeText(account);

    const timerId = setTimeout(() => {
      setIsCopied(false);
      window.navigator.clipboard.writeText("");

      clearTimeout(timerId);
    }, 1000);
  };

  const handleDisconnect = async () => {
    try {
      await revokePermission(_wallet);

      setAccount("");
      setShowAccountInfo(false);
      setWallet(null);
      setContract(undefined);
    } catch (err) {
      setToast({
        msg: "Disconnect: " + (err as Error).message,
        type: "error",
      });
    }
  };

  return (
    <div className="relative">
      <button
        className="underline cursor-pointer text-[14px] font-normal"
        onClick={account ? () => setShowAccountInfo(true) : handleConnectWallet}
      >
        [{account ? getWalletName(account) : "connect wallet"}]
      </button>

      <div
        className={`absolute bg-secondary-bg rounded-sm p-2 flex flex-col gap-4 transition-all ${
          showAccountInfo ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex gap-2">
          <pre>
            <p className="text-[14px] max-w-[150px] overflow-auto bg-background py-1 px-2 rounded-sm">
              {account}
            </p>
          </pre>
          <button
            className="text-[12px] cursor-pointer"
            onClick={handleCopyClick}
          >
            {isCopied ? "copied" : "copy"}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            className="text-[12px] cursor-pointer underline"
            onClick={handleDisconnect}
          >
            [disconnect]
          </button>

          <button
            className="text-[12px] cursor-pointer underline"
            onClick={() => setShowAccountInfo(false)}
          >
            [close]
          </button>
        </div>
      </div>
    </div>
  );
}
