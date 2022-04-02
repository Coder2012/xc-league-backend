const puppeteer = require('puppeteer');
const bot = require('./bot');

const start = async (year) => {
  const flights = [];
  const browser = await puppeteer.launch({
    'args' : [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  
  page.on('console', log => console[log._type](log._text));

  await page.goto(`http://xcleague.com/xc/leagues/${year}-1.html?vx=2`);
  let data = {
    flights: [],
    pages: []
  };

  data = await page.evaluate(
    (data, flights) => {
      const exists = (link, urls) => urls.some(url => url == link);
      const trs = document.querySelectorAll('#leagueTable tbody tr');

      for (const tr of trs) {
        let link = tr.querySelector('td:nth-child(9) a').href;
        let viewPage = link.match(/leagues/);

        if (viewPage?.[0]) {
          data.pages.push(link);
        } else if (!exists(link, flights)) {
          data.flights.push(link);
        }
      }

      return data;
    },
    data,
    flights
  );

  for (const url of data.pages) {
    await page.goto(url);

    data = await page.evaluate(
      (data, flights) => {
        const exists = (link, urls) => urls.some(url => url == link);
        const links = document.querySelectorAll(
          '#leagueTable [class^=flight] a:first-child'
        );

        for (const link of links) {
          if (!exists(link.href, flights)) data.flights.push(link.href);
        }
        return data;
      },
      data,
      flights
    );
  }

  browser.close();
  console.log(`Ready to scrape ${data.flights.length} flights`);

  bot(data.flights);
};

module.exports = start;
