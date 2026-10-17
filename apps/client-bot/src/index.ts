import { node } from "@elysiajs/node";
import { Elysia, t } from "elysia";
import { handleTelegramWebhook } from "./bot";
import { env } from "./config/env";

new Elysia({ adapter: node() })
  .get("/", () => ({ hello: "Nexous Accounting Telegram Workflows" }))
  .get("/health", () => ({ status: "ok" }))

  .post(
    "/webhook/telegram",
    async ({ request, headers, set }) => {
      const secretHeader = headers["x-telegram-bot-api-secret-token"];
      if (secretHeader !== env.TELEGRAM_WEBHOOK_SECRET) {
        set.status = 401;
        return "Unauthorized";
      }
      return await handleTelegramWebhook(request);
    },
    {
      headers: t.Object({
        "x-telegram-bot-api-secret-token": t.Optional(t.String()),
      }),
    },
  )
  .listen(env.PORT);

console.log(`Listening on ${env.PORT}`);
