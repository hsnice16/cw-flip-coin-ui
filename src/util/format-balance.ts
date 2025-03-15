export function formatBalance(balance: string) {
  if (Number(balance) < 0.001) {
    return "<0.001";
  }

  return Number(balance).toFixed(3);
}
