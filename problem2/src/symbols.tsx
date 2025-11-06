import { useState } from "react";

function getTokenIconUrl(symbol: string): string {
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`;
}

type TokenIconProps = {
  symbol: string;
  className?: string;
};

export function TokenIcon({ symbol, className }: TokenIconProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-slate-600 text-white text-[10px] font-bold ${
          className ?? ""
        }`}
        aria-label={symbol}
      >
        {symbol?.[0] ?? "?"}
      </div>
    );
  }

  return (
    <img
      alt={symbol}
      src={getTokenIconUrl(symbol)}
      onError={() => setErrored(true)}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
