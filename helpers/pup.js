const puppeteer = require("puppeteer");
const fs = require("fs");
const read = require("./storage");

const start = async () => {
    await read();
    const flights2019 = require('../tmp/flights-2019.js');
  console.log(flights2019);
  const browser = await puppeteer.launch({ pipe: true });
  const page = await browser.newPage();
  
  page.on("console", log => console[log._type](log._text));

  await page.goto("http://xcleague.com/xc/leagues/2019-1.html?vx=2");
  let data = {
    flights: [],
    pages: []
  };

  data = await page.evaluate(
    (data, flights2019) => {
      const exists = (link, urls) => urls.some(url => url == link);
      const trs = document.querySelectorAll("#leagueTable tbody tr");

      for (const tr of trs) {
        let link = tr.querySelector("td:nth-child(9) a").href;
        let viewPage = link.match(/leagues/);

        if (viewPage && viewPage[0] !== null) {
          data.pages.push(link);
        } else if (!exists(link, flights2019)) {
          data.flights.push(link);
        }
      }

      return data;
    },
    data,
    flights2019
  );

  // console.log(data);

  for (const url of data.pages) {
    await page.goto(url);

    data = await page.evaluate(
      (data, flights2019) => {
        const exists = (link, urls) => urls.some(url => url == link);
        const links = document.querySelectorAll(
          "#leagueTable [class^=flight] a:first-child"
        );

        for (const link of links) {
          if (!exists(link, flights2019)) data.flights.push(link.href);
        }
        return data;
      },
      data,
      flights2019
    );
  }

  browser.close();
  console.log('flights', data.flights);

  try {
    if (!fs.existsSync('tmp')){
      fs.mkdirSync('tmp');
    }
  } catch (err) {
    console.error(err)
  }

  const file = fs.createWriteStream('tmp/flights-latest.js')
  file.on('error', function(err) { console.log('error writing log') })
  file.write('const flights = [')
  data.flights.forEach(function(flight) { file.write(`"${flight}",\n`) })
  file.write('];\n')
  file.write('module.exports = flights;')
  file.end();

};

module.exports = start;