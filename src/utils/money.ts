import { Money } from '@/contracts/base';

/**
 * Maps standard currencies to their minor unit factor.
 * For example, USD and INR use 100 minor units (cents/paise) per major unit.
 * JPY uses 1 minor unit per major unit.
 */
const MINOR_UNIT_MAP: Record<string, number> = {
  'USD': 100,
  'INR': 100,
  'EUR': 100,
  'GBP': 100,
  'JPY': 1,
  'BHD': 1000,
  'KWD': 1000,
  'OMR': 1000,
};

/**
 * Safely formats a Money object to a localized string according to its currency rules.
 */
export const formatMoney = (money?: Money | null, locale: string = 'en-IN'): string => {
  if (!money) return '₹0.00';

  const currencyCode = money.currency.toUpperCase();
  const minorUnitFactor = MINOR_UNIT_MAP[currencyCode] || 100; // Default to 2 decimals

  const majorAmount = Number(money.amountMinor) / minorUnitFactor;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(majorAmount);
};
