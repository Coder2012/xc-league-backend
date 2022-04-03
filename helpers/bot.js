const Model = require('./model');
const Scraper = require('./scraper.js');

const init = flightUrls => {
  let scraper = new Scraper(flightUrls);
  scraper.init();

  scraper.events.on('error', error => {
    console.log('Scraper error: ', error);
    scraper.resume();
  });

  scraper.events.on('complete', async models => {

    for (let m of models) {
      const model = new Model(m);
      console.log(`Pilot: ${model.pilot} - ${model.identifier}`);

      const exists = await Model.exists({ identifier: m.identifier });
      
      if(!exists){
        model.save(err => {
          if (err) {
            console.log(err);
            console.log('Error saving: ' + model.identifier);
          }else{
            console.log('Saved', model.identifier)
          }
        });
      }else{
        console.log('Flight exists: ', model.identifier);
      }
    }

    console.log('Saving complete');
  });
};

module.exports = init;