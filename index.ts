import express from "express";
import path from "path";

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./assets/html/index.html"));
});

app.use(express.static("assets"));

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
