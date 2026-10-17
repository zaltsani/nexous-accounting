import "dotenv/config";

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  API_GATEWAY_URL: process.env.API_GATEWAY_URL || "http://localhost:3000",
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
  TELEGRAM_WEBHOOK_SECRET: process.env.TELEGRAM_WEBHOOK_SECRET || "",
  AI_PROVIDER_BASE_URL: process.env.AI_PROVIDER_BASE_URL || "",
  AI_PROVIDER_MODEL: process.env.AI_PROVIDER_MODEL || "",
  AI_PROVIDER_API_KEY: process.env.AI_PROVIDER_API_KEY || "",
};
