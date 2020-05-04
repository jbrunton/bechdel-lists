const Apify = require('apify');

Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: 'https://www.boxofficemojo.com/year/2019/' });
    //const pseudoUrls = [new Apify.PseudoUrl('https://www.iana.org/[.*]')];

    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        headless: true,
        handlePageFunction: async ({ request, page }) => {
            const title = await page.title();
            console.log(`Title of ${request.url}: ${title}`);
            const links = await page.$$eval("a[href*='/release/rl']", links => Array.from(links).map((x) => x.getAttribute('href')));
            //const releases = Array.from(links).map((x) => x.getAttribute('href'))
            //Array.from(document.querySelectorAll("a[href*='/release/rl']")).map((x) => x.getAttribute('href'))
            console.log(`LINKS: ${links}`);
            const releaseIds = links.map(link => link.match(/release\/(rl\d+)/)[1]);
            console.log(releaseIds);
                // await Apify.utils.enqueueLinks({
                //     page,
                //     selector: 'a',
                //     pseudoUrls,
                //     requestQueue,
                // });
        },
        maxRequestsPerCrawl: 100,
        maxConcurrency: 10,
    });

    await crawler.run({ headless: true });
});

// const crawler = new Apify.PuppeteerCrawler({
//   headless: true,
//   requestList,
//   handlePageFunction: async ({ page, request }) => {
//       // This function is called to extract data from a single web page
//       // 'page' is an instance of Puppeteer.Page with page.goto(request.url) already called
//       // 'request' is an instance of Request class with information about the page to load
//       await Apify.pushData({
//           title: await page.title(),
//           url: request.url,
//           succeeded: true,
//       });
//   },
//   handleFailedRequestFunction: async ({ request }) => {
//       // This function is called when the crawling of a request failed too many times
//       await Apify.pushData({
//           url: request.url,
//           succeeded: false,
//           errors: request.errorMessages,
//       });
//   },
// });

// await crawler.run();

// const puppeteer = require('puppeteer');

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://example.com');
//   await page.screenshot({path: 'example.png'});

//   await browser.close();
// })();
