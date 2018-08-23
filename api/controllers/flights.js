const mongoose = require("mongoose");
const Flight = require("../models/flight");
const responses = require("../models/responses");

exports.flights_get_all = (req, res, next) => {
    let options = {
        sort: { date: req.body.dateSort || -1 },
        page: parseInt(req.body.page),
        limit: parseInt(req.body.limit),
    };

    console.log(req.body);

    let query = {};

    if(req.body.pilot) query.pilot = req.body.pilot;
    if(req.body.glider) query.glider = req.body.glider;
    if(req.body.totalMin && req.body.totalMax) query.total = { $gte: parseInt(req.body.totalMin), $lte: parseInt(req.body.totalMax) };
    let type = req.body.responseType;

    Flight.paginate(query, options).then(function (result) {
        let response = responses[type](result);
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
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
                    flights: doc,
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

exports.get_pilots = (req, res, next) => {
    // Flight.find({}).distinct('pilot', (err, pilots) => console.log(pilots));

    Flight.find({})
        .select('pilot')
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(200).json({
                count: docs.length,
                pilots: docs
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
}
