import { Check, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { TokenIcon } from "./symbols";

type Currency = {
  value: string;
  label: string;
};

type CoinSelectProps = {
  currencies: Currency[];
  selected: Currency;
  exclude?: Currency;
  onSelect: (currency: Currency) => void;
};

export function CoinSelect({ currencies, selected, onSelect, exclude }: CoinSelectProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  const allOptions = useMemo(() => {
    return !exclude ? currencies : currencies.filter((currency) => currency.value !== exclude.value);
  }, [currencies, exclude]);

  const filterOptions = useMemo(() => {
    return allOptions.filter((currency) => currency.value.toLowerCase().includes(search.toLowerCase()));
  }, [allOptions, search]);

  const handleSelect = (currency: Currency) => {
    setIsDropdownOpen(false);
    onSelect(currency);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="w-[100px] justify-between flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-600/50 hover:opacity-80 border border-slate-500/50 transition-opacity"
      >
        <span className="text-sm font-semibold text-slate-300">{selected.value}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
      </button>
      {isDropdownOpen && (
        <>
          <div className="fixed inset-0" onClick={() => setIsDropdownOpen(false)} />
          <div className="absolute p-2  right-0 top-full mt-2 w-48 bg-slate-700 border border-slate-600 rounded-xl shadow-xl z-50 nice-scrollbar pr-1">
            <div className="flex items-center gap-2 px-2 py-1 mb-2">
              <Search className="w-4 h-4 text-slate-400" />

              <input
                className="w-full bg-transparent outline-none text-white text-sm"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-1  max-h-[200px] overflow-y-auto">
              {filterOptions.length > 0 ? (
                filterOptions.map((currency) => (
                  <button
                    key={currency.value}
                    type="button"
                    onClick={() => handleSelect(currency)}
                    className="w-full flex items-center justify-between gap-3 px-2 py-1 hover:bg-slate-600 transition-colors rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <TokenIcon symbol={currency.value} className="w-6 h-6 rounded-full flex-shrink-0" />
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white">{currency.value}</div>
                        <div className="text-xs text-slate-400">{currency.label}</div>
                      </div>
                    </div>

                    {selected.value === currency.value && <Check className="w-4 h-4 text-slate-400" />}
                  </button>
                ))
              ) : (
                <div className="text-sm text-slate-400 text-center py-2">No results found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
