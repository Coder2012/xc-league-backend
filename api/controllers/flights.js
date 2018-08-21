const mongoose = require("mongoose");
const Flight = require("../models/flight");

exports.flights_get_all = (req, res, next) => {

  var options = {
    
  };

  Flight.paginate({}, { offset: 19000, limit: 3 }).then(function(result) {
    console.log(result);
    res.status(200).json(result);
  });
  // Flight.find({})
  //   .select("_id identifier title pilot club total durationNum duration")
  //   .limit(10)
  //   .exec()
  //   .then(docs => {
  //     const response = {
  //       count: docs.length,
  //       flights: docs.map(doc => {
  //         let {_id, identifier, pilot, club, title, total, durationNum, duration} = doc;
  //         return {
  //           _id,
  //           identifier,
  //           pilot,
  //           title,
  //           club,
  //           total,
  //           durationNum,
  //           duration,
  //           request: {
  //             type: "GET",
  //             url: "http://localhost:3000/flights/" + doc._id
  //           }
  //         };
  //       })
  //     };
  //     //   if (docs.length >= 0) {
  //     res.status(200).json(response);
  //     //   } else {
  //     //       res.status(404).json({
  //     //           message: 'No entries found'
  //     //       });
  //     //   }
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.status(500).json({
  //       error: err
  //     });
  //   });
};

exports.flights_get_flight = (req, res, next) => {
  const id = req.params.flightId;
  Flight.findById(id)
    .select("identifier pilot")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/flights"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
