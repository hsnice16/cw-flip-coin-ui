"use client";

import { useState } from "react";
import ChooseInput from "./ChooseInput";
import EnterWager from "./EnterWager";
import { useAccount } from "@/context/AccountContext";
import { useToasts } from "@/context/ToastsContext";

export default function Input() {
  const [state, setState] = useState({
    isHead: false,
    wager: "",
  });

  const minimumBet = 5;
  const { balance } = useAccount();
  const { setToast } = useToasts();

  const handleSetIsHead = (isHead: boolean) => {
    setState((prev) => ({ ...prev, isHead }));
  };

  const handleSetWager = (wager: string) => {
    setState((prev) => ({ ...prev, wager }));
  };

  const handlePlaceBet = () => {
    if (Number(state.wager) < minimumBet) {
      setToast({
        msg: "Enter Wager: Place minimum bet",
        type: "error",
      });

      return;
    }

    if (Number(state.wager) > Number(balance)) {
      setToast({
        msg: "Enter Wager: Amount exceeded the wallet balance",
        type: "error",
      });

      return;
    }

    console.log(state);
  };

  return (
    <div className="flex flex-col gap-12">
      <ChooseInput isHead={state.isHead} handleSetIsHead={handleSetIsHead} />
      <EnterWager
        value={state.wager}
        handleSetWager={handleSetWager}
        minimumBet={minimumBet}
        balance={balance}
      />

      <button
        className="bg-primary text-background w-[140px] h-[34px] font-medium text-[16px] rounded-sm cursor-pointer"
        onClick={handlePlaceBet}
      >
        place bet
      </button>
    </div>
  );
}
