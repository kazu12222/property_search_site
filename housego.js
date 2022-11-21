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
let building_li;
exports.housego = async function housego(page) {
  await page.goto(
    "https://house.goo.ne.jp/buy/touhoku_uh/area_fukushima/07202.html?sk=2&pu=500",
    {
      waitUntil: ["networkidle0"],
    }
  );
  await sleep(3000);
  building_li = await page.$$(
    ".rent_tabel_box > table.property > tbody > tr:nth-child(1)"
  );

  console.log(building_li.length);
  for (i = 0; i < building_li.length; i++) {
    build_src.push(await getBuildSrc());
    link.push(await getLink(page));
    address.push(await getAdress());
    traffic.push(await getTraffic());
    price.push(await getTableItem(4));
    land_area_base = await getTableItem(6);
    land_area_base = land_area_base.replace("\n", "");
    land_area.push(land_area_base);
    build_area.push(await getBuildArea());
    let build_date_item = await getTableItem(7);
    build_date_item = build_date_item.replace("\n", "");
    build_date.push(build_date_item);
  }
  hatoarray.build_src = build_src;
  hatoarray.link = link;
  hatoarray.address = address;
  hatoarray.traffic = traffic;
  hatoarray.price = price;
  hatoarray.land_area = land_area;
  hatoarray.build_area = build_area;
  hatoarray.build_date = build_date;
  //console.log(hatoarray);
  return hatoarray;
};

async function getBuildSrc() {
  const build_src_base = await building_li[i].$(
    "td:nth-child(2) > ul > li.img"
  );
  const build_src = await build_src_base.$eval("img", (el) => el.src);
  return build_src;
}
async function getLink(page) {
  const detail_link_base = await building_li[i].$("td:nth-child(3) > a");
  const link = await page.evaluate((body) => body.href, detail_link_base);
  return link;
}
async function getAdress() {
  const address = await building_li[i].$("td:nth-child(3)");
  let address_text = await (
    await address.getProperty("textContent")
  ).jsonValue();
  address_text = address_text.split(/\n\n/);
  address_text[0] = address_text[0].replace("\n", "");
  return address_text[0];
}
async function getTraffic() {
  const address = await building_li[i].$("td:nth-child(3)");
  let address_text = await (
    await address.getProperty("textContent")
  ).jsonValue();
  address_text = address_text.split(/\n\n/);
  return address_text[1];
}
async function getBuildArea() {
  const build_ara = await building_li[i].$("td:nth-child(5)");
  let build_ara_text = await (
    await build_ara.getProperty("textContent")
  ).jsonValue();
  build_ara_text = build_ara_text.split(/\n/);
  return build_ara_text[2];
}
async function getTableItem(keynum) {
  const element = await building_li[i].$(`td:nth-child(${keynum})`);
  let element_text = await (
    await element.getProperty("textContent")
  ).jsonValue();
  return element_text;
}
