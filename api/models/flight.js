const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const flightSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    identifier: String,
    pilot: String,
    title: String,
    club: String,
    glider: String,
    date: Date,
    start: String,
    startNum: Number,
    finish: String,
    finishNum: Number,
    duration: String,
    durationNum: Number,
    takeoff: String,
    landing: String,
    total: Number,
    multiplier: String,
    score: Number,
    maxHeight: Number,
    lowHeight: Number,
    takeoffHeight: Number,
    maxClimb: Number,
    minClimb: Number,
    maxSpeed: Number,
    avgSpeedCourse: Number,
    avgSpeedTrack: Number,
    link: String
});

// flightSchema.set('autoIndex', false);
flightSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Flight', flightSchema);