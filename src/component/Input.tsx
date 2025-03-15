"use client";

import { useState } from "react";
import ChooseInput from "./ChooseInput";
import EnterWager from "./EnterWager";

export default function Input() {
  const [state, setState] = useState({
    isHead: false,
    wager: "",
  });

  const minimumBet = 5;
  const [error, setError] = useState("");

  const handleSetIsHead = (isHead: boolean) => {
    setState((prev) => ({ ...prev, isHead }));
  };

  const handleSetWager = (wager: string) => {
    setError("");
    setState((prev) => ({ ...prev, wager }));
  };

  const handlePlaceBet = () => {
    if (Number(state.wager) < minimumBet) {
      setError("place minimum bet");
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
      />

      <button
        className="bg-primary text-background w-[140px] h-[34px] font-medium text-[16px] rounded-sm cursor-pointer relative"
        onClick={handlePlaceBet}
      >
        place bet
        <p className="text-[14px] text-error absolute mt-4">{error}</p>
      </button>
    </div>
  );
}
