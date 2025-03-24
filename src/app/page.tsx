"use client";

import ConnectWallet from "@/component/ConnectWallet";
import History from "@/component/History";
import Input from "@/component/Input";
import LastBet from "@/component/LastBet";
import Pause from "@/component/Pause";
import Play from "@/component/Play";
import Toasts from "@/component/Toasts";

import { pressStart2P } from "@/constant/font";

import AccountContextProvider from "@/context/AccountContext";
import SocketContextProvider from "@/context/SocketContext";
import ToastsContextProvider from "@/context/ToastsContext";

export default function Page() {
  return (
    <ToastsContextProvider>
      <AccountContextProvider>
        <SocketContextProvider>
          <Pause />
          <Toasts />

          <div className="flex flex-col gap-12 items-start">
            <ConnectWallet />

            <div className="flex gap-28">
              <div className="flex flex-col gap-32">
                <Input />
                <Play />
              </div>

              <div className="flex flex-col gap-40 items-center">
                <History />

                <h1
                  className={`${pressStart2P.className} text-[40px] text-center w-[360px] -rotate-12`}
                >
                  Flip coin and win the prize
                </h1>
              </div>
            </div>
          </div>

          <LastBet />
        </SocketContextProvider>
      </AccountContextProvider>
    </ToastsContextProvider>
  );
}
