export function buildQueryString(params?: Record<string, any>): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (value instanceof Date) {
        const stringValue = value.toISOString();
        const encodedValue = encodeURIComponent(stringValue);
        searchParams.append(key, encodedValue);
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
