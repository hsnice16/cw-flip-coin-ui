/* eslint-disable @typescript-eslint/no-explicit-any */

import { CW_FLIP_COIN_CONTRACT, TESTNET_RPC } from "@/constant/value";
import { HistoryLog } from "@/types";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { createContext, ReactNode, useEffect } from "react";
import { useAccount } from "./AccountContext";
import { useToasts } from "./ToastsContext";
import { fromUtf8 } from "@cosmjs/encoding";
import { getEvmAddress } from "@/util/contract";

const SocketContext = createContext({});

export default function SocketContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { setLastBet, addrContract, setFlipStatus, account } = useAccount();
  const { setToast } = useToasts();

  // Listen for Flip Completed Event Function
  async function listenForFlipCompleted(
    rpcEndpoint: string,
    contractAddress: string
  ) {
    try {
      const tmClient = await Tendermint34Client.connect(rpcEndpoint);
      const stream = tmClient.subscribeTx(
        `wasm._contract_address='${contractAddress}'`
      );

      stream.subscribe({
        next: async (event) => {
          const flipCompletedEvent = event.result.events.find(
            (e) => e.type === "wasm-flip_completed"
          );

          if (flipCompletedEvent) {
            const attributes = flipCompletedEvent.attributes;
            let history: HistoryLog = {} as HistoryLog;

            for (const attribute of attributes) {
              let key = fromUtf8(attribute.key);
              let value: any = fromUtf8(attribute.value);

              switch (key) {
                case "did_win": {
                  value = value === "false" ? false : true;
                  break;
                }

                case "wager":
                case "timestamp_seconds": {
                  value = Number(value);
                  break;
                }

                case "is_head": {
                  key = "bet_is_head";
                  value = value === "false" ? false : true;
                  break;
                }
              }

              history = { ...history, [key]: value };
            }

            const player = await getEvmAddress(
              addrContract,
              history.user_address
            );

            setLastBet({
              wager: history.wager ?? 0,
              did_win: history.did_win ?? false,
              player: player ?? "",
              flip_id: history.flip_id ?? "",
            });

            if ((account ?? "").toLowerCase() === player.toLowerCase()) {
              if (history.did_win ?? false) {
                setFlipStatus("won");
              } else {
                setFlipStatus("lost");
              }
            }
          }
        },
      });
    } catch (err) {
      setToast({
        msg: "Flip Completed: " + (err as Error).message,
        type: "error",
      });
    }
  }

  // UseEffect to call Listen for Flip Completed Function
  useEffect(() => {
    listenForFlipCompleted(`wss://${TESTNET_RPC}`, CW_FLIP_COIN_CONTRACT);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addrContract, account]);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
}
