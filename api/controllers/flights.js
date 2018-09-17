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
    if(req.body.distance) query.total = { $gte: parseInt(req.body.distance)};
    if(req.body.height) query.maxHeight = { $gte: parseInt(req.body.height)};
    let type = req.body.responseType;

    Flight.paginate(query, options).then(function (result) {
        let flights = responses[type](result);
        res.status(200).json({
            flightData: flights,
            pages: result.pages,
            total: result.total
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
};

exports.flights_get_date = (req, res, next) => {
    let date = req.body.date;
    console.log('date',date)

    let options = {
        sort: { date: req.body.dateSort || -1 },
        page: parseInt(req.body.page),
        limit: parseInt(req.body.limit),
    };

    let query = {};

    if(req.body.date) query.date = new Date(date);
    let type = req.body.responseType;

    Flight.paginate(query, options).then(function (result) {
        let flights = responses[type](result);
        res.status(200).json({
            flightData: flights,
            pages: result.pages,
            total: result.total
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
};

exports.get_dates = (req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;

    Flight.find({ date: { $gte: new Date(start), $lte: new Date(end) }})
        .select('date -_id')
        .lean()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.count,
                dates: docs.map(a => a.date)
            })
        })
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
    Flight.find({}).distinct('pilot', (err, pilots) => 
    {
        console.log(pilots);
        res.status(200).json({
            pilots: pilots
        })
    });
}
