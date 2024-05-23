import fs from "fs";
import * as dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import express from "express";
import OpenAI from "openai";
import multer from "multer";

import fileUpload from "./middleware/file-upload";

dotenv.config();

const botToken = process.env.telegramToken;
const openAIkey = process.env.openAIkey;
const webUrl = process.env.webUrl;

if (!botToken || !openAIkey || !webUrl) {
  throw new Error(
    "Error occured. Please check Web URL, OpenAIkey or botToken."
  );
}

const app = express();
const upload = multer({ dest: "./uploads" });
const bot = new TelegramBot(botToken, { polling: true });
const openai = new OpenAI({ apiKey: openAIkey });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

bot.on("message", async (message) => {
  if (message.text === "/start") {
    await bot.sendMessage(
      message.chat.id,
      "Hello! Welcome to TeleVision - the mini-app for image recognition. Click the button bellow and send any image via form, and I'll try to identify its contents.",
      {
        reply_markup: {
          keyboard: [[{ text: "Send image", web_app: { url: webUrl } }]],
        },
      }
    );
  }
});

app.post("/upload", fileUpload.single("image"), async (req, res) => {
  const { file, queryId } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Success",
      input_message_content: {
        message_text: `File ${file}`,
      },
    });
    return res.status(200).json();
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Failed to purchase.",
      input_message_content: { message_text: `Error.` },
    });
    return res.status(500).json();
  }
});

app.listen(process.env.PORT || 3000);
