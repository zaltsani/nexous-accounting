import { createOpenAI } from "@ai-sdk/openai";
import { generateText, stepCountIs } from "ai";
import { Bot, webhookCallback } from "grammy";
import { env } from "./config/env";
import { SYSTEM_PROMPT } from "./config/system-prompt";
import { allGatewayTools } from "./services/ai-tools";

export const bot = new Bot(env.TELEGRAM_BOT_TOKEN);

const ai = createOpenAI({
  baseURL: env.AI_PROVIDER_BASE_URL,
  apiKey: env.AI_PROVIDER_API_KEY,
});

bot.on("message:text", async (ctx) => {
  const userMessage = ctx.message.text;
  await ctx.replyWithChatAction("typing");

  console.log({ userMessage });

  try {
    const response = await generateText({
      model: ai(env.AI_PROVIDER_MODEL),
      system: SYSTEM_PROMPT,
      prompt: userMessage,
      tools: allGatewayTools,
      stopWhen: stepCountIs(5),
    });

    console.log({ "AI Response Output:": response, responseText: response.text });

    const responseResult = response.text;
    await ctx.reply(responseResult || "Task executed successfully.", { parse_mode: "Markdown" });
  } catch (err) {
    console.error("Workflow Error:", err);
    await ctx.reply("Failed to complete request.");
  }
});

export const handleTelegramWebhook = webhookCallback(bot, "std/http");
