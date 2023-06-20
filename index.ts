import express from "express";
import path from "path";
import Database from "./server/database";
import { config as env } from "dotenv";
env();

import uploadRouter from "./server/files/uploadRouter";

export const db = new Database()
export const app = express();

// routes
app.use("/upload", uploadRouter);


app.get("/", (req, res) => {
  res.sendFile(path.resolve("./assets/html/index.html"));
});

app.use(express.static("assets"));

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
