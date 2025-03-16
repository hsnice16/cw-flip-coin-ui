import { useAccount } from "@/context/AccountContext";
import { getPauseStatus } from "@/util/contract";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useToasts } from "@/context/ToastsContext";

export default function Pause() {
  const { contract } = useAccount();
  const { setToast } = useToasts();
  const [pauseStatus, setPauseStatus] = useState(false);

  useEffect(() => {
    (async function fetchPauseStatus() {
      try {
        const pauseStatus = await getPauseStatus(contract);
        setPauseStatus(pauseStatus);
      } catch (err) {
        setToast({
          msg: "Pause Status: " + (err as Error).message,
          type: "error",
        });
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  if (pauseStatus === false) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-pause-background z-10 flex pointer-events-none">
      <div className="bg-secondary-bg m-auto p-4 rounded-sm max-w-2xs flex items-start gap-3">
        <Image src="./warning.svg" alt="warning" width={40} height={40} />

        <p>
          The contract is either under maintenance or has stopped its
          operations.
          <br />
          <br />
          Thanks for your visit!
        </p>
      </div>
    </div>
  );
}
