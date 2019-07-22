const Model = require('./model');
const Scraper = require('./scraper.js');

const init = (flightUrls) => {
  let scraper = new Scraper(flightUrls);

  scraper.events.on('error', function(error) {
    console.log('Scraper error: ', error);
    scraper.resume();
  });

  scraper.events.on('complete', function(models) {
    Model.schema.pre('save', function(next) {
      var self = this;
      Model.find({ identifier: self.identifier }, function(err, docs) {
        if (docs === null || docs.length === 0) {
          console.log('Saving', self.identifier);
          next();
        } else {
          console.log('Flight exists: ', self.identifier);
          next(new Error('Flight exists!'));
        }
      });
    });

    for (let m of models) {
      let model = new Model(m);
      console.log(`Pilot: ${model.pilot} - ${model.identifier}`);
      model.save(function(err) {
        if (err) {
          console.log('Error saving: ' + model.identifier);
        }else{
          console.log('Saved', model.identifier)
        }
      });
    }

    console.log('Saving complete');
  });
};

module.exports = init;