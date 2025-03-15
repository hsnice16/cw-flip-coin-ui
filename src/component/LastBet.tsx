import { getRandomInt } from "@/util/get-random-int";
import Image from "next/image";

export default function LastBet() {
  const randomInt = getRandomInt(3);

  return (
    <div
      className={`flex gap-2 ${
        randomInt === 0
          ? "bg-lb-maroon"
          : randomInt === 1
          ? "bg-lb-crimson"
          : "bg-lb-gray"
      } ${
        randomInt === 0
          ? "text-lb-gray"
          : randomInt === 1
          ? "text-foreground"
          : "text-background"
      } rounded-sm px-2 py-1 w-1/3 absolute bottom-8 left-10`}
    >
      {randomInt === 0 ? (
        <Image
          src="./sei-logo-white.svg"
          alt="Sei Red Logo"
          width={18}
          height={18}
        />
      ) : randomInt === 1 ? (
        <Image
          src="./sei-logo-black.svg"
          alt="Sei Red Logo"
          width={18}
          height={18}
        />
      ) : (
        <Image
          src="./sei-logo-red.svg"
          alt="Sei Red Logo"
          width={18}
          height={18}
        />
      )}

      <p className="text-[14px]">
        <span className="font-semibold">last bet: </span>
        player <span className="font-semibold">abmnyz, </span>
        did_win <span className="font-semibold">yes, </span>
        wager <span className="font-semibold">4 sei</span>
      </p>
    </div>
  );
}
