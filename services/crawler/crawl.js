const puppeteer = require('puppeteer');
const argv = require('yargs').argv;

const listUrl = argv.list;
if (!listUrl) {
  throw Error("Required --list url to be given.");
}

process.on('unhandledRejection', error => {
  console.log(error);
  process.exit(1);
});

const titleIdRegex = /title\/tt(\d+)/
const summaryHeadingSelector = '.mojo-performance-summary-table .a-section span.a-size-small';
const summaryValuesSelector = '.mojo-performance-summary-table .a-section span.money'

async function getBoxOfficeDetails(page) {
  const summaryHeadings = await page.$$eval(summaryHeadingSelector, headings => {
    return Array.from(headings).map(heading => heading.innerText)
  });
  const summaryValues = await page.$$eval(summaryValuesSelector, headings => {
    return Array.from(headings).map(heading => heading.innerText)
  });
  const domesticIndex = summaryHeadings.findIndex(heading => heading.toLowerCase().includes('domestic'));
  const globalIndex = summaryHeadings.findIndex(heading => heading.toLowerCase().includes('worldwide'));
  return {
    domestic: summaryValues[domesticIndex],
    global: summaryValues[globalIndex]
  }
}

async function getReleaseDetails(page, releaseId) {
  const releaseUrl = `https://www.boxofficemojo.com/release/${releaseId}`;
  console.log(`Fetching release ${releaseId} from ${releaseUrl}`);
  await page.goto(releaseUrl);

  const title = await page.$eval('h1', heading => heading.innerText);
  const titleLink = await page.$eval("a.mojo-title-link[href*='/title/tt']", link => link.getAttribute('href'));
  const titleId = titleLink.match(titleIdRegex)[1];
  const boxOfficeDetails = await getBoxOfficeDetails(page);

  return {
    title: title,
    imdbId: titleId,
    boxOffice: boxOfficeDetails
  };
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(listUrl);

  const top100links = (await page.$$eval("a[href*='/release/rl']", links => {
    return Array.from(links).map(link => link.getAttribute('href'))
  })).slice(0, 5);


  const releaseIdRegex = /release\/(rl\d+)/
  const releaseIds = top100links.map(link => link.match(releaseIdRegex)[1]);
  console.log(releaseIds);

  for (let releaseId of releaseIds) {
    const releaseDetails = await getReleaseDetails(page, releaseId);
    console.log(JSON.stringify(releaseDetails, null, 2));
  }

  await browser.close();
})();
