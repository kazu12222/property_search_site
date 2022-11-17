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
exports.hatomark = async function hatomark(page) {
  await page.goto(
    "https://www.hatomarksite.com/search/zentaku/buy/house/area/07/list?m_adr%5B%5d=07202&m_adr%5B%5d=07203&m_adr%5B%5d=07208&m_adr%5B%5d=07408&m_adr%5B%5d=07421&page=1",
    {
      waitUntil: ["networkidle0"],
    }
  );
  await page.select('select[name="price_b_to"]', "5000000");
  const search_button = await getElements(
    'button[type="submit"',
    /^検索$/,
    page
  );
  search_button.click();
  await page.waitForNavigation();
  const list_table = await page.$(".list-table");
  building_li = await list_table.$$(".col-12"); //偶数でカード
  console.log(building_li.length);
  for (i = 0; i < building_li.length - 1; i = i + 2) {
    build_src.push(await getBuildSrc());
    link.push(await getLink(page));
    address.push(await getAdress());
    traffic.push(await getTraffic());
    price.push(await getTableItem(/価格/));
    land_area.push(await getTableItem(/土地面積/));
    build_area.push(await getTableItem(/建物面積/));
    build_date.push(await getTableItem(/築年月/));
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
  return hatoarray;
};

async function getBuildSrc() {
  const build_src_base = await building_li[i].$(".img-wrap");
  const build_src = await build_src_base.$eval("img", (el) => el.src);
  return build_src;
}
async function getLink(page) {
  const detail_link_base = await getElements("a", /詳細を見る/, building_li[i]);
  const link = await page.evaluate((body) => body.href, detail_link_base);
  return link;
}
async function getAdress() {
  const address = await building_li[i].$(".address");
  let address_text = await (
    await address.getProperty("textContent")
  ).jsonValue();
  address_text = address_text.replace("MAP", "");
  return address_text;
}
async function getTraffic() {
  const traffic = await building_li[i].$(".traffic");
  let traffic_text = await (
    await traffic.getProperty("textContent")
  ).jsonValue();
  traffic_text = traffic_text.replace("駅までmap", "");
  return traffic_text;
}
async function getTableItem(keyword) {
  const element_base = await getElements(".col", keyword, building_li[i]);
  const element = await element_base.$(".room-detail-value");
  let element_text = await (
    await element.getProperty("textContent")
  ).jsonValue();
  return element_text;
}

async function getElements(Elementname, textContent, A) {
  let resultSelectors = await A.$$(Elementname);
  let resultsArray = [];
  let keyFlag = "";
  for (let i = 0; i < resultSelectors.length; i++) {
    resultsArray.push(
      await (await resultSelectors[i].getProperty("textContent")).jsonValue()
    );
    //console.log(resultsArray[i]);
    if (resultsArray[i].match(textContent)) {
      keyFlag = i;
      break;
    }
  }
  return resultSelectors[keyFlag];
}
