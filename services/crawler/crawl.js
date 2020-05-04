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

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(listUrl);

  const top100links = (await page.$$eval("a[href*='/release/rl']", links => {
    return Array.from(links).map(link => link.getAttribute('href'))
  })).slice(0, 5);

  const titleIdRegex = /title\/tt(\d+)/

  const releaseIdRegex = /release\/(rl\d+)/
  const releaseIds = top100links.map(link => link.match(releaseIdRegex)[1]);
  console.log(releaseIds);

  const summaryHeadingSelector = '.mojo-performance-summary-table .a-section span.a-size-small';
  const summaryValuesSelector = '.mojo-performance-summary-table .a-section span.money'

  for (let releaseId of releaseIds) {
    const releaseUrl = `https://www.boxofficemojo.com/release/${releaseId}`;
    console.log(`Fetching release ${releaseId} from ${releaseUrl}`);
    await page.goto(releaseUrl);

    const title = await page.$eval('h1', heading => heading.innerText);
    const summaryHeadings = await page.$$eval(summaryHeadingSelector, headings => {
      return Array.from(headings).map(heading => heading.innerText)
    });
    const summaryValues = await page.$$eval(summaryValuesSelector, headings => {
      return Array.from(headings).map(heading => heading.innerText)
    });
    const domesticIndex = summaryHeadings.findIndex(heading => heading.toLowerCase().includes('domestic'));
    const globalIndex = summaryHeadings.findIndex(heading => heading.toLowerCase().includes('worldwide'));
    const domesticBoxOffice = summaryValues[domesticIndex];
    const globalBoxOffice = summaryValues[globalIndex];

    const titleLink = await page.$eval("a.mojo-title-link[href*='/title/tt']", link => link.getAttribute('href'));
    const titleId = titleLink.match(titleIdRegex)[1];

    const movieDetails = {
      title: title,
      imdbId: titleId,
      boxOffice: {
        domestic: domesticBoxOffice,
        global: globalBoxOffice
      }
    };

    console.log(JSON.stringify(movieDetails, null, 2));
  }

  await browser.close();
})();
