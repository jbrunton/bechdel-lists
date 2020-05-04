const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.boxofficemojo.com/year/2019/');

  const title = await page.title();
  console.log(`Title: ${title}`);
  const links = await page.$$eval("a[href*='/release/rl']", links => Array.from(links).map((x) => x.getAttribute('href')));
  //const releases = Array.from(links).map((x) => x.getAttribute('href'))
  //Array.from(document.querySelectorAll("a[href*='/release/rl']")).map((x) => x.getAttribute('href'))
  console.log(`LINKS: ${links}`);
  const releaseIds = links.map(link => link.match(/release\/(rl\d+)/)[1]);
  console.log(releaseIds);

  await browser.close();
})();
