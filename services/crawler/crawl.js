const puppeteer = require('puppeteer');
const fs = require('fs');

process.on('unhandledRejection', error => {
  console.log(error);
  process.exit(1);
});

const lists = [];
for (let year = 2009; year < 2020; ++year) {
  lists.push({
    year: year,
    listUrl: `https://www.boxofficemojo.com/year/${year}/`
  });
}

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

async function getListDetails(page, listUrl) {
  console.log(`Fetching list from ${listUrl}`);
  await page.goto(listUrl);

  const topLinks = (await page.$$eval("a[href*='/release/rl']", links => {
    return Array.from(links).map(link => link.getAttribute('href'))
  })).slice(0, 10);

  const releaseIdRegex = /release\/(rl\d+)/
  const releaseIds = topLinks.map(link => link.match(releaseIdRegex)[1]);
  console.log(releaseIds);

  const movies = [];
  for (let releaseId of releaseIds) {
    const releaseDetails = await getReleaseDetails(page, releaseId);
    console.log(JSON.stringify(releaseDetails, null, 2));
    movies.push(releaseDetails);
  }
  return movies;
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const movies = [];
  for (let { year, listUrl } of lists) {
    const listDetails = await getListDetails(page, listUrl);
    for (let movieDetails of listDetails) {
      movieDetails.year = year;
    }
    movies.push(...listDetails);
  }

  await browser.close();
  fs.writeFileSync('topmovies.json', JSON.stringify(movies, null, 2));
})();
