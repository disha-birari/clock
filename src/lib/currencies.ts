export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';

export interface CurrencyDetail {
  code: CurrencyCode;
  symbol: string;
  rateVsUsd: number;
  label: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyDetail> = {
  USD: { code: 'USD', symbol: '$', rateVsUsd: 1.0, label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', rateVsUsd: 0.92, label: 'EUR (€)' },
  GBP: { code: 'GBP', symbol: '£', rateVsUsd: 0.78, label: 'GBP (£)' },
  INR: { code: 'INR', symbol: '₹', rateVsUsd: 83.5, label: 'INR (₹)' },
  JPY: { code: 'JPY', symbol: '¥', rateVsUsd: 155.0, label: 'JPY (¥)' },
};

export function formatCurrencyAmount(amountUsd: number, currencyCode: CurrencyCode): string {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = amountUsd * curr.rateVsUsd;
  if (currencyCode === 'INR' || currencyCode === 'JPY') {
    return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${curr.symbol}${converted.toFixed(2)}`;
}
