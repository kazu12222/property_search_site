const { exit } = require("process");
const puppeteer = require("puppeteer");
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
let hatoarray = {
  build_src: "",
  link: "",
  address: "",
  traffic: "",
  price: "",
  land_area: "",
  build_area: "",
  build_date: "",
};
let build_src = [];
let link = [];
let address = [];
let traffic = [];
let price = [];
let land_area = [];
let build_area = [];
let build_date = [];
(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 30,
    args: ["--lang=ja"],
  });
  const page = await browser.newPage();
  //////////鳩マーク//////////////////
  await page.goto(
    "https://myhome.nifty.com/chuko/ikkodate/hokkaido-tohoku/fukushima/aizuwakamatsushi/?subtype=buh&isFromSearch=1",
    {
      waitUntil: ["networkidle0"],
    }
  );
  await page.select('select[name="b2"]', "10000000");
  await sleep(5000);
  const building_li = await page.$$(".nayose");

  console.log(building_li.length);

  for (i = 0; i < building_li.length; i++) {
    build_src.push(await getBuildSrc());
    link.push(await getLink());
    address.push(await getTableItem(1));
    traffic.push(await getTableItem(2));
    price.push(await getTableItem(0));
    land_area.push(await getTableItem(4));
    build_area.push(await getTableItem(5));
    build_date.push(await getTableItem(6));
  }
  hatoarray.build_src = build_src;
  hatoarray.link = link;
  hatoarray.address = address;
  hatoarray.traffic = traffic;
  hatoarray.price = price;
  hatoarray.land_area = land_area;
  hatoarray.build_area = build_area;
  hatoarray.build_date = build_date;
  console.log(hatoarray);
  await browser.close();

  async function getBuildSrc() {
    const build_src_base = await building_li[i].$(".mainImageRect > a");
    const build_src = await build_src_base.$eval("img", (el) => el.src);
    return build_src;
  }
  async function getLink() {
    const detail_link_base = await building_li[i].$(".mainImageRect > a");
    const link = await page.evaluate((body) => body.href, detail_link_base);
    return link;
  }
  async function getTableItem(keynum) {
    const element = await building_li[i].$$(
      "div.itemContentWrapper.clearfix > dl.itemContent.clearfix > dd"
    );
    let element_text = await (
      await element[keynum].getProperty("textContent")
    ).jsonValue();
    return element_text;
  }
})();
