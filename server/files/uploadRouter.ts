import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { db } from "../../index";
import { Track } from "../database/entities/track";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./data/upload"));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage, limits: { fileSize: 25000000 } }); // 25MB

router.post(
  "/",
  upload.fields([
    {
      name: "track",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  (req, res) => {
    if (!req.files) {
      return res.status(400).json({
        error: "No files were uploaded.",
      });
    }

    const title = req.body.title as string;
    const description = req.body.description as string;
    // @ts-ignore
    const track = req.files["track"][0] as Express.Multer.File;
    // @ts-ignore
    const image = req.files["image"][0] as Express.Multer.File;
    const author = req.body.author as string;

    const trackEntity = db.em.create(Track, {
      title,
      description,
      author,
    });

    db.em.persist(trackEntity);

    // move files to data/track and data/image respectively
    // rename files to their track id

    const trackPath = path.resolve(`./data/track/${trackEntity.id}.stt`);
    const imagePath = path.resolve(`./data/image/${trackEntity.id}.png`);
     
    fs.rename(track.path, trackPath, (err) => {
      if (err) {
        return res.status(500).json({
          error: "Failed to move track file",
        });
      }
    });

    fs.rename(image.path, imagePath, (err) => {
      if (err) {
        return res.status(500).json({
          error: "Failed to move image file",
        });
      }
    });

    db.em.flush().then(() => {
      res.redirect(`/track/${trackEntity.id}#uploadSuccess`);
    });
  }
);

router.get("/", (req, res) => {
    res.sendFile(path.resolve("./assets/html/upload.html"));
});

export default router;
