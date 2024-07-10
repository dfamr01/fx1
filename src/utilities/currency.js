import localStorage from "./localStorage.js";

export const UNLIMITED = -1;
export const CURRENCIES = {
  ILS: { key: "ILS", value: "Israeli New Sheqel", symbol: "₪" },
  USD: { key: "USD", value: "United States Dollar", symbol: "$" },
  EUR: { key: "EUR", value: "Euro", symbol: "€" },
  // GBP: {key: 'GBP', value: 'British Pound Sterling', symbol: '£'},
};

export async function getCurrency() {
  let currency = await localStorage.getItem("currency");
  return currency || CURRENCIES.ILS;
}

export async function setCurrency(currency) {
  await set(currency);
}

function set(currency) {
  return localStorage.setItem("currency", currency);
}
