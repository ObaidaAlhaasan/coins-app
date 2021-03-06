import React, {ChangeEvent, FC, useCallback, useEffect, useMemo, useState} from "react";
import {CryptoIcon, LoadingError, LoadingSpinner} from "../../../../components";
import {CryptoCurrency, ExchangeSrc, ICryptoAsset, ResponseStatus, strOrNum} from "../../../../types/cryptos";
import {useDebounce, useRate, useCryptoAssets} from "../../../../lib/hooks";
import {isNotNullOrEmpty, isNullOrEmpty,} from "../../../../utils/string-utils";
import {useStore} from "../../../../store/store";
import "./trade-form.scss";

const DelayEventInMilliSecond = 250;
const TradeForm: FC = () => {
  const {data: response, status: fetchCryptoStatus} = useCryptoAssets();

  const [crypto, setCrypto] = useState<ICryptoAsset>();
  const [cryptoAmt, setCryptoAmt] = useState<strOrNum>("");
  const [currency, setCurrency] = useState<strOrNum>("");
  const [exchangeSrc, setExchangeSrc] = useState<ExchangeSrc>(ExchangeSrc.Crypto);

  const debouncedCurrency = useDebounce<strOrNum>(currency, DelayEventInMilliSecond);
  const debouncedCryptoAmt = useDebounce<strOrNum>(cryptoAmt, DelayEventInMilliSecond);

  const cryptos = useMemo(() => response?.data ?? [], [response?.data]);


  const {refetch: refetchCryptoRate, status: fetchRateStatus, error} = useRate(crypto, CryptoCurrency.USD);

  const fetchRateErrMsg = error as string;

  const {currentUser} = useStore();

  useEffect(() => {
    setCrypto(cryptos[0]);
  }, [cryptos]);

  const fetchCryptoRate = useCallback(() => {
    refetchCryptoRate().then(({data, status}) => {
      if (status !== ResponseStatus.Success || !data?.rate) return;
      const value = Number(cryptoAmt) * data?.rate ?? "";
      setCurrency(value);
    });
  }, [cryptoAmt]);

  const fetchCurrencyRate = useCallback(() => {
    refetchCryptoRate().then(({data, status}) => {
      if (status !== ResponseStatus.Success || !data?.rate) return;

      const value = Number(currency) / data?.rate ?? "";
      setCryptoAmt(value);
    });
  }, [currency]);

  const resetState = useCallback(() => {
    try {
      if (isNotNullOrEmpty(cryptoAmt)) setCryptoAmt("");

      if (isNotNullOrEmpty(currency)) setCurrency("");

      if (exchangeSrc !== ExchangeSrc.Crypto)
        setExchangeSrc(ExchangeSrc.Crypto);
    } catch (e) {
      console.error(e);
    }
  }, [cryptoAmt, currency, exchangeSrc]);

  useEffect(() => {
    if (exchangeSrc === ExchangeSrc.Currency || isNullOrEmpty(debouncedCryptoAmt))
      return;

    fetchCryptoRate();
  }, [debouncedCryptoAmt, exchangeSrc]);

  useEffect(() => {
    if (exchangeSrc === ExchangeSrc.Crypto || isNullOrEmpty(debouncedCurrency))
      return;

    fetchCurrencyRate();
  }, [debouncedCurrency, exchangeSrc]);

  if (fetchCryptoStatus === ResponseStatus.Loading)
    return <LoadingSpinner/>;

  if (fetchCryptoStatus === ResponseStatus.Error)
    return <LoadingError title="Crypto Assets"/>;

  const onSelectCrypto = (d: ICryptoAsset) => {
    setCrypto(d);
    resetState();
  };

  const onCryptoAmtChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNullOrEmpty(value)) {
      setCurrency("");
    }

    setCryptoAmt(value);
    setExchangeSrc(ExchangeSrc.Crypto);
  };

  const onCurrencyChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNullOrEmpty(value)) {
      setCryptoAmt("");
    }

    setCurrency(value);
    setExchangeSrc(ExchangeSrc.Currency);
  };

  return (
    <div className="trade-form has-glass-bg">
      {!currentUser && (
        <h5 className="text-white">
          Please <span className="has-text-primary">Login</span> to use Trade
          form
        </h5>
      )}
      <div className="input-group input-group-prepend">
        <input
          placeholder="0.00"
          type="number"
          className="form-control"
          aria-label="Crypto Amount"
          onChange={onCryptoAmtChange}
          value={cryptoAmt}
          disabled={!currentUser}
        />
        <div className="input-group-append">
          <div className="dropdown">
            <button
              className="btn btn-sm dropdown-toggle btn-outline-secondary has-text-primary"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              disabled={!currentUser}
              data-testid="btn-test"
            >
              <CryptoIcon iconName={crypto?.symbol ?? ""}/>
              <span>{crypto?.symbol ?? ""}</span>
            </button>
            <ul
              className="dropdown-menu small overflow-auto"
              aria-labelledby="dropdownMenuButton"
            >
              {cryptos.map((c: ICryptoAsset, i) => (
                <li key={i}>
                  <button
                    className="dropdown-item btn-sm d-flex align-items-center gap-2"
                    onClick={() => onSelectCrypto(c)}
                    disabled={!currentUser}
                  >
                    <CryptoIcon iconName={c?.symbol ?? ""}/>
                    <span className="has-text-secondary">{c.symbol}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="crypto-form-separator text-center my-3">
        <span className="crypto-form-separator--line">
          <i
            className={` fas fa-sync position-relative has-text-primary ${
              fetchRateStatus === "loading" && "has-loop"
            }`}
          />
        </span>
      </div>

      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="h-100 input-group-text has-text-primary bg-transparent has-primary-border-color">
            <i className="fas fa-dollar-sign "/>
          </span>
        </div>
        <input
          placeholder="0.00"
          type="number"
          className="form-control"
          aria-label="Crypto In currency USD"
          value={currency}
          onChange={onCurrencyChange}
          disabled={!currentUser}
        />
      </div>
      {currentUser && fetchRateErrMsg && (
        <p className="invalid-feedback d-block">{fetchRateErrMsg}</p>
      )}
    </div>
  );
};

export default TradeForm;
