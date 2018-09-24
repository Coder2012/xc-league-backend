const stream = require('stream');
const mongoose = require("mongoose");
const excel = require('node-excel-export');
const Flight = require("../models/flight");
const responses = require("../models/responses");

let data = null;

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
    if(req.body.takeoff) query.takeoff = req.body.takeoff;
    if(req.body.distance) query.total = { $gte: parseInt(req.body.distance)};
    if(req.body.height) query.maxHeight = { $gte: parseInt(req.body.height)};
    let type = req.body.responseType;

    Flight.paginate(query, options).then(function (result) {
        // let flights = responses[type](result);
        let flights = responses[type](result);
        data = flights.flights;
        console.log(data);
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
        sort: { score: -1 },
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

  const styles = {
    headerDark: {
      fill: {
        fgColor: {
          rgb: 'FF000000'
        }
      },
      font: {
        color: {
          rgb: 'FFFFFFFF'
        },
        sz: 14,
        bold: true
      }
    },
    cellPink: {
      fill: {
        fgColor: {
          rgb: 'FFFFCCFF'
        }
      }
    },
    cellGreen: {
      fill: {
        fgColor: {
          rgb: 'FF00FF00'
        }
      }
    },
    cellDark: {
      fill: {
        fgColor: {
          rgb: 'FF1C1C1C'
        }
      }
    }
  };
  
  const ExcelSpecification = {
      pilot: {
        displayName: 'Pilot',
        headerStyle: styles.headerDark,
        width: 180
      },
      title: {
        displayName: 'Title',
        headerStyle: styles.headerDark,
        width: 180
      },
      club: {
        displayName: 'Club',
        headerStyle: styles.headerDark,
        width: 180
      },
      glider: {
        displayName: 'Glider',
        headerStyle: styles.headerDark,
        width: 180
      },
      date: {
        displayName: 'Date',
        headerStyle: styles.headerDark,
        width: 180
      },
      start: {
        displayName: 'Start time',
        headerStyle: styles.headerDark,
        width: 180
      },
      finish: {
        displayName: 'Finish time',
        headerStyle: styles.headerDark,
        width: 180
      },
      duration: {
        displayName: 'Duration',
        headerStyle: styles.headerDark,
        width: 180
      },
      takeoff: {
        displayName: 'Takeoff',
        headerStyle: styles.headerDark,
        width: 180
      },
      landing: {
        displayName: 'Landing',
        headerStyle: styles.headerDark,
        width: 180
      },
      total: {
        displayName: 'Total',
        headerStyle: styles.headerDark,
        width: 180
      },
      multiplier: {
        displayName: 'Multiplier',
        headerStyle: styles.headerDark,
        width: 180
      },
      score: {
        displayName: 'Score',
        headerStyle: styles.headerDark,
        width: 180
      },
      maxHeight: {
        displayName: 'Max Height',
        headerStyle: styles.headerDark,
        width: 180
      },
      lowHeight: {
        displayName: 'Low Height',
        headerStyle: styles.headerDark,
        width: 180
      },
      takeoffHeight: {
        displayName: 'Takeoff Height',
        headerStyle: styles.headerDark,
        width: 180
      },
      maxClimb: {
        displayName: 'Max Climb',
        headerStyle: styles.headerDark,
        width: 180
      },
      minClimb: {
        displayName: 'Min Climb',
        headerStyle: styles.headerDark,
        width: 180
      },
      maxSpeed: {
        displayName: 'Max Speed',
        headerStyle: styles.headerDark,
        width: 180
      },
      avgSpeedCourse: {
        displayName: 'Average Speed Course',
        headerStyle: styles.headerDark,
        width: 180
      }
    }

exports.generate_report = (req, res, next) => {
    console.log('data', data);
    const report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
          {
            name: 'Flights', // <- Specify sheet name (optional)
            //heading: heading, // <- Raw heading array (optional)
            //merges: merges, // <- Merge cell ranges
            specification: ExcelSpecification, // <- Report specification
            data: data // <-- Report data
          }
        ]
      );
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    res.send(report);
}
