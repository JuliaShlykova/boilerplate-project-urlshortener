require("dotenv").config();
const express = require("express");
const dns = require("node:dns");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

let shorturls = [];

app.post("/api/shorturl", async (req, res) => {
  try {
    const { url } = req.body;
    const urlObject = new URL(url);
    dns.lookup(urlObject.hostname, (err, address, family) => {
      if (err) {
        res.json({ error: "invalid url" });
      } else {
        shorturls.push(url);
        res.json({ original_url: url, short_url: shorturls.length - 1 });
      }
    });
  } catch (err) {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:shorturlNumber", (req, res) => {
  const { shorturlNumber } = req.params;
  if (Number(shorturlNumber) > shorturls.legnth - 1) {
    res.json({ error: "invalid url" });
  } else {
    res.redirect(shorturls[shorturlNumber]);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
