import Image from "next/image";
import Confetti from "./Confetti";

export default function YouWon() {
  return (
    <div className="fixed inset-0 bg-pause-background z-10 flex pointer-events-none">
      <Confetti />

      <div className="bg-secondary-bg m-auto p-4 rounded-sm max-w-2xs flex flex-col gap-4">
        <Image
          src="./you-won.gif"
          alt="you won"
          width={140}
          height={240}
          unoptimized={true}
        />

        <p>
          <strong>You Won!</strong>
        </p>
      </div>
    </div>
  );
}
