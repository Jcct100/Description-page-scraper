const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

let browser;
const allData = [];

async function scrapeHomesInIndexPage(url) {
  try {
    const page = await browser.newPage();
    await page.goto(url);
    const html = await page.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);

    const homes = $(".tile a")
      .map(
        (i, element) => "https://principles.design" + $(element).attr("href")
      )
      .get();
    return homes;
  } catch (err) {
    console.error(errr);
  }
}

async function scrapeDescriptionPage(url, page) {
  try {
    await page.goto(url);
    const html = await page.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);

    const title = $("body > main > div > div > header > h1").text();

    $("body > main > div > div > article > ol")
      .find("h2")
      .text((i, principles) => {
        const json = {
          title,
          principles
        };
        allData.push({ json });
      });
  } catch (err) {
    console.error(err);
  }
}

async function main() {
  browser = await puppeteer.launch({ headless: false });
  const descriptionPage = await browser.newPage();
  const homes = await scrapeHomesInIndexPage(
    "https://principles.design/examples"
  );

  for (var i = 0; i < homes.length; i++) {
    await scrapeDescriptionPage(homes[i], descriptionPage);
  }
}

main();
