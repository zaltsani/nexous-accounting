import { env } from "../config/env";

export async function gatewayFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${env.API_GATEWAY_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gateway Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data as Promise<T>;
}
