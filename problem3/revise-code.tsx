//@ts-nocheck

interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

const getPriority = (blockchain: any): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

export function WalletPage() {
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances: FormattedWalletBalance[] = useMemo(
    () =>
      balances
        .filter((balance: WalletBalance) => getPriority(balance.blockchain) > -99 && balance.amount > 0)
        .map(
          (balance: WalletBalance): FormattedWalletBalance => ({
            ...balance,
            formatted: balance.amount.toFixed(),
          })
        )
        .sort((lhs: FormattedWalletBalance, rhs: FormattedWalletBalance) => {
          const leftPriority = getPriority(lhs.blockchain);
          const rightPriority = getPriority(rhs.blockchain);
          if (leftPriority > rightPriority) return -1;
          if (leftPriority < rightPriority) return 1;
          return 0;
        }),
    [balances]
  );

  return (
    <div>
      {formattedBalances.map((balance) => {
        const price = prices?.[balance.currency] ?? 0;
        const usdValue = price * balance.amount;
        return (
          <WalletRow
            className={classes.row}
            key={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      })}
    </div>
  );
}
