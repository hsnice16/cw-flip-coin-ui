import History from "@/component/History";
import Input from "@/component/Input";
import Play from "@/component/Play";
import { pressStart2P } from "@/constant/font";

export default function Home() {
  return (
    <>
      <button className="underline cursor-pointer text-[14px] font-normal">
        connect wallet
      </button>

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
    </>
  );
}
