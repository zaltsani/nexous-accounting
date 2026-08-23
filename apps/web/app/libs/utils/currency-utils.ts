export const formatRupiah = (
  value: number | string | undefined | null,
  maxDecimals: number = 2,
): string => {
  if (value === undefined || value === null || value === "") return "";

  if (typeof value === "number") {
    if (isNaN(value)) return "";
    const formattedNumber = new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: maxDecimals,
    }).format(value);
    return `Rp ${formattedNumber}`;
  }

  const strValue = value.toString();

  const isNegative = strValue.startsWith("-");

  let cleanString = strValue.replace(/[^\d.]/g, "");
  const firstDotIndex = cleanString.indexOf(".");
  if (firstDotIndex !== -1) {
    cleanString =
      cleanString.slice(0, firstDotIndex + 1) +
      cleanString.slice(firstDotIndex + 1).replace(/\./g, "");
  }

  if (!cleanString) return "";

  const [integerPart, decimalPart] = cleanString.split(".");

  const formattedInteger = integerPart
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : "0";

  const prefix = isNegative ? "Rp -" : "Rp ";

  if (decimalPart !== undefined) {
    const truncatedDecimal = maxDecimals > 0 ? decimalPart.slice(0, maxDecimals) : "";
    return `${prefix}${formattedInteger}${truncatedDecimal ? `,${truncatedDecimal}` : ""}`;
  }

  return `${prefix}${formattedInteger}`;
};
