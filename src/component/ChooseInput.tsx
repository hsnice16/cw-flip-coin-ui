import Image from "next/image";

type ChooseInputProps = {
  isHead: boolean;
  handleSetIsHead: (isHead: boolean) => void;
};

export default function ChooseInput({
  isHead,
  handleSetIsHead,
}: ChooseInputProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-semibold text-[18px]">choose</h2>

      <div className="flex gap-9">
        <div
          className={`bg-secondary-bg w-[194px] h-[122px] rounded-sm flex items-end justify-between p-4 cursor-pointer border transition-all ${
            isHead ? "border-lb-gray" : "border-secondary-bg"
          }`}
          onClick={() => handleSetIsHead(true)}
        >
          <p className="mb-1 text-[14px] font-medium">heads</p>
          <Image
            src="/sei-logo-red.svg"
            alt="Sei Red Logo"
            width={86}
            height={86}
          />
        </div>

        <div
          className={`bg-secondary-bg w-[194px] h-[122px] rounded-sm flex items-end justify-between p-4 cursor-pointer border transition-all ${
            isHead ? "border-secondary-bg" : "border-lb-gray"
          }`}
          onClick={() => handleSetIsHead(false)}
        >
          <p className="mb-1 text-[14px] font-medium">tails</p>
          <Image
            src="/sei-logo-white.svg"
            alt="Sei White Logo"
            width={86}
            height={86}
          />
        </div>
      </div>
    </div>
  );
}
