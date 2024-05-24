import * as dotenv from "dotenv";
import path from "path";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

import fileUpload from "./middleware/file-upload";

dotenv.config();

const botToken = process.env.botToken;
const openAIkey = process.env.openAIkey;
const webUrl = process.env.webUrl;

if (!botToken || !openAIkey || !webUrl) {
  throw new Error(
    "Error occured. Please check Web URL, OpenAIkey or botToken."
  );
}

const app = express();
const bot = new TelegramBot(botToken, { polling: true });
const openai = new OpenAI({ apiKey: openAIkey });

app.use(bodyParser.json());

app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "..", "uploads", "images"))
);

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

//   next();
// });

bot.on("message", async (message) => {
  if (message.text === "/start") {
    await bot.sendMessage(
      message.chat.id,
      "Hello! Welcome to TeleVision - the mini-app for image recognition. Click the send button bellow and send any image via form, and I'll try to identify its contents."
    );
  }
});

app.post(
  "/",
  fileUpload.single("image"),
  async (req: Request, res: Response) => {
    const { queryId, image } = req.body.formData;

    if (!image) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      await bot.answerWebAppQuery(queryId, {
        type: "photo",
        id: queryId,
        photo_url: image.path,
        thumb_url: image.path,
      });

      return res.status(200).json();
    } catch (e) {
      await bot.answerWebAppQuery(queryId, {
        type: "article",
        id: queryId,
        title: "Failed to process the file",
        input_message_content: { message_text: `Failed to process the file` },
      });
      return res.status(500).json();
    }
  }
);

app.listen(process.env.PORT || 3000);
