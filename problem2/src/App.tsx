import { CoinSelect } from "./CoinSelect";
import { Controller, useForm, type FieldValues } from "react-hook-form";
import { CURRENCIES } from "./currency";
import { TokenIcon } from "./symbols";
import { useGetExchangeRate } from "./useGetExchangeRate";
import { useEffect } from "react";

function App() {
  const { getExchangeRate, isFetching } = useGetExchangeRate();
  const methods = useForm({
    defaultValues: {
      amountToSend: "",
      amountToReceive: "",
      sendCurrency: CURRENCIES[0],
      receiveCurrency: CURRENCIES[1],
      rate: 0,
    },
    mode: "onSubmit",
  });
  console.log("🚀 ~ App ~ methods:", methods.formState.errors);

  const sendCurrency = methods.watch("sendCurrency");
  const receiveCurrency = methods.watch("receiveCurrency");
  const rate = methods.watch("rate");

  const handleSwap = async (values: FieldValues) => {
    if (Number(values.amountToSend) <= 0) {
      methods.setError("amountToSend", { message: "Amount to send must be greater than 0" });
      return;
    }
    if (Number(values.amountToReceive) <= 0) {
      methods.setError("amountToReceive", { message: "Amount to receive must be greater than 0" });
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.alert(
      `Swap confirmed for ${values.amountToSend} ${values.sendCurrency.value} to ${values.amountToReceive} ${values.receiveCurrency.value}`
    );
  };

  const handleChangeAmountToSend = async () => {
    const amountToSend = methods.getValues("amountToSend");
    const currentRate = methods.getValues("rate");

    if (amountToSend && rate) {
      const amountToReceive = Number(amountToSend) * Number(currentRate);
      methods.setValue("amountToReceive", amountToReceive.toFixed(3));
    }
  };

  const handleChangeAmountToReceive = async () => {
    const amountToReceive = methods.getValues("amountToReceive");
    const currentRate = methods.getValues("rate");

    if (amountToReceive && rate) {
      const amountToSend = Number(amountToReceive) / Number(currentRate);
      methods.setValue("amountToSend", amountToSend.toFixed(3));
    }
  };

  const handleChangeCurrency = async () => {
    const currentSendCurrency = methods.getValues("sendCurrency");
    const currentReceiveCurrency = methods.getValues("receiveCurrency");
    const response = await getExchangeRate(currentSendCurrency.value, currentReceiveCurrency.value);
    if (response.success && response.rate) {
      methods.setValue("rate", Number(response.rate));
    } else {
      methods.setError("rate", { message: response.message });
    }
  };

  useEffect(() => {
    // run only for the first time
    handleChangeCurrency();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Swap Coins</h1>
            <p className="text-slate-400">Exchange your tokens instantly</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSwap} className="space-y-6">
            {/* Send Field */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-x-5">
                <label className="text-sm font-medium text-slate-300">Amount to send</label>
                {methods.formState.errors.amountToSend && (
                  <span className="text-red-500 text-xs">{methods.formState.errors.amountToSend.message}</span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <TokenIcon symbol={sendCurrency.value} className="w-8 h-8 rounded-full flex-shrink-0" />
                </div>
                <Controller
                  name="amountToSend"
                  control={methods.control}
                  render={({ field }) => (
                    <input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      className="appearance-none w-full bg-slate-700/50 border border-slate-600/50 rounded-2xl py-4 pl-16 pr-32 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                      onBlur={() => handleChangeAmountToSend()}
                    />
                  )}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <Controller
                    name="sendCurrency"
                    control={methods.control}
                    render={({ field }) => (
                      <CoinSelect
                        exclude={receiveCurrency}
                        currencies={CURRENCIES}
                        selected={field.value}
                        onSelect={(currency) => {
                          field.onChange(currency);
                          handleChangeCurrency();
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Receive Field */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Amount to receive</label>
                {methods.formState.errors.amountToReceive && (
                  <span className="text-red-500 text-xs">{methods.formState.errors.amountToReceive.message}</span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <TokenIcon symbol={receiveCurrency.value} className="w-8 h-8 rounded-full flex-shrink-0" />
                  </div>
                </div>
                <Controller
                  name="amountToReceive"
                  control={methods.control}
                  render={({ field }) => (
                    <input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      className="appearance-none w-full bg-slate-700/50 border border-slate-600/50 rounded-2xl py-4 pl-16 pr-32 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                      onBlur={() => handleChangeAmountToReceive()}
                    />
                  )}
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <Controller
                    name="receiveCurrency"
                    control={methods.control}
                    render={({ field }) => (
                      <CoinSelect
                        exclude={sendCurrency}
                        currencies={CURRENCIES}
                        selected={field.value}
                        onSelect={(currency) => {
                          field.onChange(currency);
                          handleChangeCurrency();
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Exchange Rate Info */}
            <div className="">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Exchange rate</span>
                {isFetching ? (
                  <div className="w-[140px] h-5 bg-slate-50/50 animate-pulse rounded-[2px]" />
                ) : (
                  <span className="text-white font-semibold">
                    1 {sendCurrency.value} = {rate} {receiveCurrency.value}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={methods.handleSubmit(handleSwap)}
              disabled={isFetching || methods.formState.isSubmitting}
              className="disabled:opacity-50 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-80 text-white font-bold py-4 rounded-2xl transition-opacity duration-200 border border-blue-500/30"
            >
              {methods.formState.isSubmitting ? "Confirming..." : "Confirm Swap"}
            </button>
          </form>
        </div>

        {/* Footer Info */}
      </div>
    </div>
  );
}

export default App;
