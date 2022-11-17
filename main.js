//expressモジュールの読み込み
//const express = require("express");
const puppeteer = require("puppeteer");
//const { sleep } = require("../lib.js");
const athome = require("./athome.js");
const hatomark = require("./hatomark.js");
const housego = require("./housego.js");
const nifty = require("./nifty.js");
const aisumu = require("./aisumu.js");
//const app = express();
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
// app.listen(8000, () => {
//   console.log("サーバー起動中");
// });

// app.get("/scrape", async (req, res) => {
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    //slowMo: 30,
    args: ["--lang=ja"],
  });
  const page = await browser.newPage();

  let hato_array = await hatomark.hatomark(page);
  let athome_array = await athome.athome(page);
  let housego_array = await housego.housego(page);
  let nifty_array = await nifty.nifty(page);
  let aisumu_array = await aisumu.aisumu(page);
  await browser.close();
  // //console.log(hato_array);
  // console.log(athome_array);
  //console.log(housego_array);
  // console.log(nifty_array);
  // console.log(aisumu_array);
  // res.json({
  //   userName: userName,
  //   subjectName: subjectName,
  //   score: score,
  //   schedule: schedule,
  // });
  // });
})();
