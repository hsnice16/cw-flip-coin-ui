"use client";

import { useEffect, useState } from "react";
import ChooseInput from "./ChooseInput";
import EnterWager from "./EnterWager";
import { useAccount } from "@/context/AccountContext";
import { useToasts } from "@/context/ToastsContext";
import { flip, getMinimumBet } from "@/util/contract";
import YouWon from "./YouWon";

export default function Input() {
  const [state, setState] = useState({
    isHead: false,
    wager: "",
  });

  const { balance, contract, fetchHistory } = useAccount();
  const { setToast } = useToasts();
  const [minimumBet, setMinimumBet] = useState(-1);
  const [showYouWon, setShowYouWon] = useState(false);

  useEffect(() => {
    (async function fetchMinimumBet() {
      try {
        const minimumBet = await getMinimumBet(contract);
        setMinimumBet(minimumBet);
      } catch (err) {
        setToast({
          msg: "Minimum Bet: " + (err as Error).message,
          type: "error",
        });
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const handleSetIsHead = (isHead: boolean) => {
    setState((prev) => ({ ...prev, isHead }));
  };

  const handleSetWager = (wager: string) => {
    setState((prev) => ({ ...prev, wager }));
  };

  const handlePlaceBet = async () => {
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

    await flip(contract, state.isHead, Number(state.wager));

    handleSetWager("")
    fetchHistory();
  };

  const isPlaceBetDisabled = !state.wager;

  return (
    <div className="flex flex-col gap-12">
      {showYouWon ? <YouWon /> : null}

      <ChooseInput isHead={state.isHead} handleSetIsHead={handleSetIsHead} />
      <EnterWager
        value={state.wager}
        handleSetWager={handleSetWager}
        minimumBet={minimumBet}
        balance={balance}
      />

      <button
        className={`bg-primary text-background w-[140px] h-[34px] font-medium text-[16px] rounded-sm ${
          isPlaceBetDisabled
            ? "opacity-50 pointer-events-none"
            : "cursor-pointer"
        }`}
        onClick={handlePlaceBet}
        disabled={isPlaceBetDisabled}
      >
        place bet
      </button>
    </div>
  );
}
