import { CW_DECIMALS } from "@/constant/value";
import { useAccount } from "@/context/AccountContext";
import { getWalletName } from "@/util/wallet";
import { useEffect, useRef } from "react";
import Image from "next/image";

export default function History() {
  const { contract, history, fetchHistory } = useAccount();
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (contract) {
      fetchHistory();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  }, [history.length]);

  return (
    <div className="flex flex-col gap-4 self-end min-h-[314px]">
      <h2 className="font-bold text-[26px]">history log</h2>

      <table
        className="max-h-[514px] overflow-auto block scroll-smooth"
        ref={tableRef}
      >
        <thead className="font-semibold text-[18px] sticky top-0 bg-background">
          <tr>
            <th className="w-[102px] text-left">player</th>
            <th className="w-[52px] text-left">did_win</th>
            <th className="w-[142px] text-right">wager (sei)</th>
          </tr>
        </thead>

        <tbody className="font-normal text-[14px]">
          {contract ? (
            history.length < 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-4 opacity-75">
                  <Image
                    src="./history-log.svg"
                    alt="history log"
                    width={40}
                    height={40}
                    className="m-auto"
                  />
                  <p>no history</p>
                </td>
              </tr>
            ) : (
              history.map((_history) => {
                return (
                  <tr key={_history.flip_id}>
                    <td className="w-[102px]">
                      {getWalletName(_history.user_address)}
                    </td>
                    <td className="w-[52px]">
                      {_history.did_win ? "yes" : "no"}
                    </td>
                    <td className="w-[142px] text-right">
                      {_history.wager / 10 ** CW_DECIMALS}
                    </td>
                  </tr>
                );
              })
            )
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4 opacity-75">
                <Image
                  src="./history-log.svg"
                  alt="history log"
                  width={40}
                  height={40}
                  className="m-auto"
                />
                <p>connect wallet</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
