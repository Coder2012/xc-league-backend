const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const flightRoutes = require("./api/routes/flights");

const pwd = encodeURIComponent(process.env.MONGODB_ATLAS_PWD);
const url = process.env.MONGODB_ATLAS_PWD
  ? `mongodb://nebrown:${pwd}@paragliding-nodejs-shard-00-00-ocmr9.mongodb.net:27017,paragliding-nodejs-shard-00-01-ocmr9.mongodb.net:27017,paragliding-nodejs-shard-00-02-ocmr9.mongodb.net:27017/test?ssl=true&replicaSet=paragliding-nodejs-shard-0&authSource=admin&retryWrites=true`
  : `mongodb://127.0.0.1:27017/?authSource=admin`;

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);
mongoose.connect(url);

mongoose.connection.on("error", function (err) {
  console.error("MongoDB Connection Error: ", err);
});

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const domain = process.env.MONGODB_ATLAS_PWD
  ? "https://www.xcleague.net"
  : "http://localhost:3001";

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/flights", flightRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
