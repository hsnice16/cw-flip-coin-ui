import { formatBalance } from "@/util/format-balance";
import Image from "next/image";

type EnterWagerProps = {
  value: string;
  handleSetWager: (wager: string) => void;
  minimumBet: number;
  balance: string;
};

export default function EnterWager({
  value,
  handleSetWager,
  minimumBet,
  balance,
}: EnterWagerProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-semibold text-[18px]">enter wager</h2>

      <div className="flex flex-col max-w-[348px] gap-4">
        <div className="border-lb-gray border bg-secondary-bg rounded-sm w-[348px] h-[36px] flex px-4 gap-2">
          <input
            type="number"
            className="flex-1 text-right outline-none font-medium text-[14px]"
            value={value}
            onChange={(event) => handleSetWager(event.target.value)}
          />
          <Image
            src="./sei-name-logo-red.svg"
            alt="Sei Named Red Logo"
            width={38}
            height={16}
          />
        </div>

        <div>
          <p className="text-right font-normal text-[14px] mr-4">
            <span className="font-medium">minimum bet: </span>
            {minimumBet < 0 ? "-" : formatBalance(String(minimumBet))} sei
          </p>

          <p className="text-right font-normal text-[14px] mr-4">
            <span className="font-medium">your balance: </span>
            {balance ? formatBalance(balance) : "-"} sei
          </p>
        </div>
      </div>
    </div>
  );
}
