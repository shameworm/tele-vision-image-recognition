import path from "path";
import fs from "fs";
import * as dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import express from "express";
import OpenAI from "openai";
import multer from "multer";

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
const upload = multer({ dest: "uploads/" });
const bot = new TelegramBot(botToken, { polling: true });
const openai = new OpenAI({apiKey: openAIkey});

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

app.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const {queryId, file, previewPath} = req.body;

  try {
    const imagePath = req.file.path;
    const image = fs.readFileSync(imagePath);

    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Success",
      input_message_content: {
        message_text: `file: ${file}\n previewUrl : ${previewPath}`,
      },
    });
    return res.status(200).json();    // const response = await openai.chat.completions.create({
    //   model: "gpt-4o",
    //   messages: [
    //     {
    //       role: "user",
    //       content: [
    //         { type: "text", text: "What’s in this image?" },
    //         {
    //           type: "image_url",

    //         },
    //       ],
    //     },
    //   ],
    // });
  } catch (error) {
    res.status(500).json({ message: "An unknown error occured!" });
  }
});

app.listen(process.env.PORT || 3000);
