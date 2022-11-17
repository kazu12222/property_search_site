//expressモジュールの読み込み
const express = require("express");
const puppeteer = require("puppeteer");
const { sleep } = require("../lib.js");
const scraping = require("./scraping2.js");
const athome = require("./athome.js");
const hatomark = require("./hatomark.js");
const housego = require("./housego.js");
const nifty = require("./nifty.js");
const aisumu = require("./aisumu.js");
const app = express();

app.listen(8000, () => {
  console.log("サーバー起動中");
});

app.get("/scrape", async (req, res) => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 30,
    args: ["--lang=ja"],
  });
  const page = await browser.newPage();
  await scraping.login(page, req.query.id, req.query.password);
  await sleep(5000);
  const userName = await scraping.userName(page);
  await sleep(5000);
  const subjectName = await scraping.subjectName(page, browser);
  await sleep(5000);
  const score = await scraping.score(page, browser);
  await sleep(5000);
  const schedule = await scraping.schedule(page, browser);
  res.json({
    userName: userName,
    subjectName: subjectName,
    score: score,
    schedule: schedule,
  });
});
