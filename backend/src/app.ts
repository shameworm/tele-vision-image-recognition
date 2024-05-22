import * as dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import express from "express";

dotenv.config();

const botToken = process.env.telegramToken;
const webUrl = "http://localhost:5173";

if (!botToken) {
  throw new Error("Bot token is missing or invalid.");
}

const bot = new TelegramBot(botToken, { polling: true });
const app = express();

bot.on("message", async (message) => {
  if (message.text === "/start") {
    await bot.sendMessage(
      message.chat.id,
      "Hello! Welcome to TeleVision - the mini-app for image recognition. Click the button bellow and send any image via form, and I'll try to identify its contents.",
      {
        reply_markup: {
          keyboard: [[{ text: "Send image" }]],
        },
      }
    );
  }
});
