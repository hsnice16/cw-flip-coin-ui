import Image from "next/image";
import Confetti from "./Confetti";
import { useAccount } from "@/context/AccountContext";

export default function FlipStatus() {
  const { flipStatus, setFlipStatus } = useAccount();

  if (flipStatus === "") {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-pause-background z-10 flex"
      onClick={() => setFlipStatus("")}
    >
      {flipStatus === "won" ? <Confetti /> : null}

      <div className="bg-secondary-bg m-auto p-4 rounded-sm max-w-2xs flex flex-col gap-4 pointer-events-none">
        {flipStatus === "won" ? (
          <Image
            src="./you-won.gif"
            alt="you won"
            width={140}
            height={240}
            unoptimized={true}
          />
        ) : null}

        {flipStatus === "lost" ? (
          <Image
            src="./you-lost.gif"
            alt="you lost"
            width={140}
            height={240}
            unoptimized={true}
          />
        ) : null}

        <p>
          {flipStatus === "won" ? <strong>You Won!</strong> : null}
          {flipStatus === "lost" ? <strong>You Lost!</strong> : null}
        </p>
      </div>
    </div>
  );
}
