export const formatRawInputString = (rawInput: string, maxDecimals: number = 2): string => {
  if (!rawInput) return "";

  if (maxDecimals === 0) {
    const integerOnly = rawInput.replace(/[^\d]/g, "");
    return integerOnly ? new Intl.NumberFormat("id-ID").format(Number(integerOnly)) : "";
  }

  const parts = rawInput.replace(/[^\d,]/g, "").split(",");
  const integerPart = parts[0].replace(/[^\d]/g, "");

  const formattedInteger = integerPart
    ? new Intl.NumberFormat("id-ID").format(Number(integerPart))
    : parts.length > 1
      ? "0"
      : "";

  if (parts.length > 1) {
    const decimalPart = parts[1].replace(/[^\d]/g, "").slice(0, maxDecimals);
    return `${formattedInteger},${decimalPart}`;
  }

  return formattedInteger;
};

export const formatInputNumber = (
  value: number | string | undefined | null,
  maxDecimals: number = 2,
): string => {
  if (value === undefined || value === null || value === "") return "";

  let rawString = value.toString().replace(/\s/g, "");

  if (typeof value === "number") {
    rawString = Number.isInteger(value)
      ? value.toString()
      : value.toFixed(maxDecimals).replace(".", ",");
  }

  const parts = rawString.split(",");

  const integerPart = parts[0].replace(/[^\d]/g, "");

  const rawDecimalPart = parts.length > 1 ? parts[1].replace(/[^\d]/g, "") : null;
  const decimalPart = rawDecimalPart !== null ? rawDecimalPart.slice(0, maxDecimals) : null;

  if (!integerPart && decimalPart === null) return "";

  const formattedInteger = integerPart
    ? new Intl.NumberFormat("id-ID").format(Number(integerPart))
    : "0";

  if (decimalPart !== null) {
    return `${formattedInteger},${decimalPart}`;
  }

  return formattedInteger;
};

export const parseInputNumberToFloat = (
  value: string | number | undefined | null,
  maxDecimals: number = 2,
): number | null => {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number") return value;

  const cleanValue = value.toString().replace(/\s/g, "");

  if (maxDecimals === 0) {
    const integerOnly = cleanValue.replace(/[^\d]/g, "");
    if (!integerOnly) return null;
    const parsedInt = parseInt(integerOnly, 10);
    return isNaN(parsedInt) ? null : parsedInt;
  }

  const parts = cleanValue.split(",");
  const integerPart = parts[0].replace(/[^\d]/g, "");
  const rawDecimalPart = parts.length > 1 ? parts[1].replace(/[^\d]/g, "") : null;
  const decimalPart = rawDecimalPart !== null ? rawDecimalPart.slice(0, maxDecimals) : null;

  if (!integerPart && decimalPart === null) return null;

  const normalizedStr = decimalPart !== null ? `${integerPart || "0"}.${decimalPart}` : integerPart;

  const parsed = parseFloat(normalizedStr);
  return isNaN(parsed) ? null : parsed;
};

export const formatCurrencyInputValue = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null || value === "") return "";

  let rawString = value.toString().replace(/Rp|\s/g, "");

  if (typeof value === "number") {
    rawString = Number.isInteger(value) ? value.toString() : value.toFixed(2).replace(".", ",");
  }

  const parts = rawString.split(",");

  const integerPart = parts[0].replace(/[^\d]/g, "");

  const rawDecimalPart = parts.length > 1 ? parts[1].replace(/[^\d]/g, "") : null;
  const decimalPart = rawDecimalPart !== null ? rawDecimalPart.slice(0, 2) : null;

  if (!integerPart && decimalPart === null) return "";

  const formattedInteger = integerPart
    ? new Intl.NumberFormat("id-ID").format(Number(integerPart))
    : "0";

  if (decimalPart !== null) {
    return `${formattedInteger},${decimalPart}`;
  }

  return formattedInteger;
};

export const parseCurrencyInputValueToNumber = (
  value: string | number | undefined | null,
): number | null => {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number") return value;

  let cleanValue = value.replace(/Rp|\s/g, "");

  const parts = cleanValue.split(",");

  const integerPart = parts[0].replace(/[^\d]/g, "");

  const rawDecimalPart = parts.length > 1 ? parts[1].replace(/[^\d]/g, "") : null;
  const decimalPart = rawDecimalPart !== null ? rawDecimalPart.slice(0, 2) : null;

  if (!integerPart && decimalPart === null) return null;

  const normalizedStr = decimalPart !== null ? `${integerPart || "0"}.${decimalPart}` : integerPart;

  const parsed = parseFloat(normalizedStr);
  return isNaN(parsed) ? null : parsed;
};
