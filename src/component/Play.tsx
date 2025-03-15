export default function Play() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-[26px]">play?</h2>

      <ol className="font-normal text-[16px] list-decimal list-inside">
        <li>choose a coin side, heads or tails</li>
        <li>enter the wager amount</li>
        <li>send a transaction (place bet)</li>
        <li>receive the prize amount in your wallet, if you win</li>
      </ol>
    </div>
  );
}
