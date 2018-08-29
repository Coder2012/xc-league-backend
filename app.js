const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require('./api/routes/user');
const flightRoutes = require('./api/routes/flights');

// const pwd = encodeURIComponent(process.env.MONGODB_ATLAS_PWD);
const pwd = encodeURIComponent('Kevlar#1');

mongoose.connect(
  `mongodb://nebrown:${pwd}@paragliding-nodejs-shard-00-00-ocmr9.mongodb.net:27017,paragliding-nodejs-shard-00-01-ocmr9.mongodb.net:27017,paragliding-nodejs-shard-00-02-ocmr9.mongodb.net:27017/test?ssl=true&replicaSet=paragliding-nodejs-shard-0&authSource=admin&retryWrites=true`
);

mongoose.connection.on('error', function(err) {
  console.error('MongoDB Connection Error: ', err);
});

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
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
      message: error.message
    }
  });
});

module.exports = app;
