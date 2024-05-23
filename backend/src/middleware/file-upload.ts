import multer from "multer";
import { v1 as uuid } from "uuid";

import { Request } from "express";
import { Multer } from "multer";

const MIME_TYPE_MAP: { [key: string]: string } = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload: Multer = multer({
  limits: { fileSize: 500000 },
  storage: multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: Function) => {
      cb(null, "./uploads/images");
    },
    filename: (req: Request, file: Express.Multer.File, cb: Function) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + "." + ext);
    },
  }),
  fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

export default fileUpload;
