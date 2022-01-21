import {ExternalUrlsConstants} from "./constants";
import {CryptoCurrency, ICryptoAsset, ICryptoAssetResponse, ICryptoRateResponse} from "../types/cryptos";

const cryptoField = `&fields=id,slug,symbol,metrics/market_data/price_usd`;
export const fetchCryptos = async (page: number = 1, count: number = 10): Promise<ICryptoAssetResponse> =>
  await fetch(`${ExternalUrlsConstants.CryptoAssets}?page=${page}&limit=${count}${cryptoField}`).then(r => r.json());


export const fetchCryptoRate = async (crypto: ICryptoAsset | undefined, currency: CryptoCurrency): Promise<ICryptoRateResponse> => {
  if (!crypto || !currency) {
    console.log("crypto", crypto, "amt", currency);
    return Promise.reject("Invalid argument value");
  }
  return await fetch(`${ExternalUrlsConstants.CryptoRate}/${crypto.symbol}/${currency}?apiKey=${'1CBD7F05-BE84-4227-959E-3207E1FEEBBE'}`).then(r => r.json());
}