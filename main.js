//expressモジュールの読み込み
//const express = require("express");
const puppeteer = require("puppeteer");
//const { sleep } = require("../lib.js");
const athome = require("./athome.js");
const hatomark = require("./hatomark.js");
const housego = require("./housego.js");
const nifty = require("./nifty.js");
const aisumu = require("./aisumu.js");
let property = {
  build_src: "",
  link: "",
  address: "",
  traffic: "",
  price: "",
  land_area: "",
  build_area: "",
  build_date: "",
};
// const app = express();
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

  //htmlを突っ込んでいく
  let build_array = [];
  let build_src = [];
  let link = [];
  let address = [];
  let traffic = [];
  let price = [];
  let land_area = [];
  let build_area = [];
  let build_date = [];

  build_array.push(await hatomark.hatomark(page));
  //build_array.push(await athome.athome(page));
  build_array.push(await housego.housego(page));
  build_array.push(await nifty.nifty(page));
  build_array.push(await aisumu.aisumu(page));
  for (i = 0; i < build_array.length; i++) {
    for (j = 0; j < build_array[i].build_src.length; j++) {
      build_src.push(build_array[i].build_src[j]);
      link.push(build_array[i].link[j]);
      address.push(build_array[i].address[j]);
      traffic.push(build_array[i].traffic[j]);
      price.push(build_array[i].price[j]);
      land_area.push(build_array[i].land_area[j]);
      build_area.push(build_array[i].build_area[j]);
      build_date.push(build_array[i].build_date[j]);
    }
  }
  property.build_src = build_src;
  property.link = link;
  property.address = address;
  property.traffic = traffic;
  property.price = price;
  property.land_area = land_area;
  property.build_area = build_area;
  property.build_date = build_date;
  console.log(property);
  console.log(property.build_src.length);
  const newpage = await browser.newPage();
  await newpage.evaluate((property) => {
    for (i = 0; i < property.build_src.length; i++) {
      const build_src = property.build_src[i];
      const link = property.link[i];
      const address = property.address[i];
      const traffic = property.traffic[i];
      const price = property.price[i];
      const land_area = property.land_area[i];
      const build_area = property.build_area[i];
      const build_date = property.build_date[i];
      let str = `<div style ="border: 1px solid #ddd; border-bottom: none;">
    <h2 style="border-bottom: 1px solid #ddd;
    padding: 9px 10px 7px;
    background: #F6F5E7;
    text-decoration: none;
    color: #333;
    font-size: 16px;">
      <p style="margin: 0;
      padding: 0;
      font-size: 1em;">
      <a href='${link}' target="_blank">
          ${address}</a>
      </p>
    </h2>
    <div class="itemBody">
      <p class="itemDescription"></p>
      <div class="clearfix">
        <div style="float: left;
        margin-right: 9px;
        width: 227px;">
          <p class="mainImageRect">
            <a href="/chuko/ikkodate/fukushima/aizuwakamatsushi/suumof_70599242/" target="_blank" data-pbcd-track-on-click="">
              <img alt=A src=${build_src} height="127" width="170">
            </a>
          </p>
        </div>
        <div>
          <dl style="width: 100%;
          line-height: 1.5;">
          <dt style="background: #f1f9c5;
          font-weight: normal;
          color: #224619;">価格</dt>
            <dd style="font-size: 1.25em;
            font-weight: bold;
            color: #ec5300;">${price}</dd>
          <dt style="background: #f1f9c5;
          font-weight: normal;
          color: #224619;">所在地</dt>
            <dd>${address}</dd>
          <dt style="background: #f1f9c5;
          font-weight: normal;
          color: #224619;">交通</dt>
            <dd>${traffic}</dd>
          <dt style="background: #f1f9c5;
          font-weight: normal;
          color: #224619;">土地面積</dt>
            <dd style="padding-left: 195;">${land_area}</dd>
          <dt style="background: #f1f9c5;
          font-weight: normal;
          color: #224619;
          padding-left: 234;">建物面積</dt>
            <dd style="padding-left: 195;">${build_area}</dd>
          <dt  style="background: #f1f9c5;
          font-weight: normal;
          color: #224619;
          padding-left: 234;">築年月</dt>
            <dd style="padding-left: 195;">${build_date}</dd>
          </dl>
        </div>
      </div>
  </div>`;
      var div = document.createElement("div");
      div.innerHTML = str; //html要素に変換
      document.body.appendChild(div); //bodyに追加
    }
  }, property);
})();
