import { useState } from "react";

type RateItem = {
  currency: string;
  date: string;
  price: number;
};

export function useGetExchangeRate() {
  const [isFetching, setIsFetching] = useState(false);

  const getExchangeRate = async (from: string, to: string) => {
    setIsFetching(true);
    try {
      // fake loading state
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch(`https://interview.switcheo.com/prices.json`);
      const data: RateItem[] = await response.json();
      const fromCurrencyRateFromUSD = data.find((item) => item.currency === from);

      if (!fromCurrencyRateFromUSD) {
        throw new Error(`Currency ${from} not found`);
      }

      const toCurrencyRateFromUSD = data.find((item) => item.currency === to);

      if (!toCurrencyRateFromUSD) {
        throw new Error(`Currency ${to} not found`);
      }

      return { success: true, rate: Number(fromCurrencyRateFromUSD.price / toCurrencyRateFromUSD.price).toFixed(3) };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    } finally {
      setIsFetching(false);
    }
  };

  return { getExchangeRate, isFetching };
}
