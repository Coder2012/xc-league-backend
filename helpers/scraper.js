const https = require('https');
const cheerio = require('cheerio');
const moment = require('moment');
const EventEmitter = require('events');

const STATUS_CODES = https.STATUS_CODES, regex = /\d+/;

let id = '';

class Scraper {
    constructor(flightUrls = []) {
        this.eventEmitter = new EventEmitter();
        this.index = 0;
        this.urls = flightUrls;
        this.url = flightUrls[this.index];
    }
    
    init() {
        this.models = [];
    
        this.eventEmitter.on('loadedPilotPage', (html) => {
            this.url = this.urls[this.index];
            this.loadPage('loadedFlightPage');
        });
    
        this.eventEmitter.on('loadedFlightPage', (html) => {
            let nextUrl = this.parseFlightPage(html);
            if (nextUrl !== undefined && nextUrl !== 'undefined') {
                this.url = nextUrl;
                this.loadPage('loadedFlightPage');
            } else {
                if (this.index < this.urls.length - 1) {
                    this.index++;
                    this.url = this.urls[this.index];
                    this.loadPage('loadedFlightPage');
                } else {
                    this.eventEmitter.emit('complete', this.models);
                }
            }
        });
    
        this.loadPage('loadedPilotPage');
    };
    
    resume() {
        this.eventEmitter.emit('loadedFlightPage');
    }
    
    loadPage(eventName) {
        id = this.url.match(regex)[0];
        console.log("id: ", id);
        
        https.get(this.url, (res) => {
            let body = '';
            if (res.statusCode !== 200) {
                return this.eventEmitter.emit('error', STATUS_CODES[res.statusCode]);
            }
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                this.eventEmitter.emit(eventName, body);
            });
        })
        .on('error', (err) => {
            console.log('error url:', this.url);
            this.eventEmitter.emit('error', err);
        });
    };

    getLeagueTable() {
        return new Promise((resolve, reject) => {
            this.loadPage('loadedLeagueTable');
            this.EventEmitter.on('loadedLeagueTable', (html) => {
                resolve(this.parseLeagueTable(html));
            });
        });
    }
    
    parseLeagueTable(html) {
        let $ = cheerio.load(html);
        let table = $('#leagueTable');   
        let rows = table.find('tr');
        let flights = [];
    
        rows.each(function(index, el) {
            let row = $(el);
            let tds = row.find('td');
            let flightData = {
                pilot: tds.eq(1).text(),
                club: tds.eq(2).text(),
                glider: tds.eq(3).text(),
                score: tds.eq(4).text()
            }
            tds.eq(6).find('a').eq('1').attr('href');
            fights.push(flightData);
        });
    
        return flights;
    };
    
    parseFlightPage(html) {
        if (html === undefined) {
            return undefined;
        }
    
        let $ = cheerio.load(html);
    
        $('#coordinates').remove();
    
        let pilot = $('.vfPilot').text();
        let title = $('.vfFlightText').text();
    
        let club = '',
            glider = '',
            date = '',
            start = '',
            finish = '',
            duration = '',
            takeoff = '',
            landing = '',
            total = '',
            multiplier = '',
            score = '';
    
        let totalCollected = false;
    
        $('.viewRow').each(function(index, el) {
            let $el = $(el);
            let label = $el.find('.viewLabel').text();
            let text = $el.find('.viewText').text();
    
            switch (label) {
                case 'Club':
                    club = text;
                    break;
    
                case 'Glider':
                    glider = text;
                    break;
    
                case 'Date':
                    date = text;
                    break;
    
                case 'Start':
                    start = text;
                    break;
    
                case 'Finish':
                    finish = text;
                    break;
    
                case 'Duration':
                    duration = text;
                    break;
    
                case 'Takeoff':
                    takeoff = text;
                    break;
    
                case 'Landing':
                    landing = text;
                    break;
    
                case 'Total':
                    if (!totalCollected) {
                        totalCollected = true;
                        total = text;
                    }
                    break;
    
                case 'Multiplier':
                    multiplier = text;
                    break;
    
                case 'Score':
                    score = text;
                    break;
    
                default:
                    0;
            }
        });
    
        // get stats from panel
        let stats = $('#xcTab-stats-content');
        let maxHeight = stats.find('#xcTab-stats-height-max').text();
        let lowHeight = stats.find('#xcTab-stats-height-low').text();
        let takeoffHeight = stats.find('#xcTab-stats-height-ta').text();
        let maxClimb = stats.find('#xcTab-stats-climb-max').text();
        let minClimb = stats.find('#xcTab-stats-climb-min').text();
        let maxSpeed = stats.find('#xcTab-stats-speed-max').text();
        let avgSpeedCourse = stats.find('#xcTab-stats-speed-avgCourse').text();
        let avgSpeedTrack = stats.find('#xcTab-stats-speed-avgCourse').text();
    
        let model = {
            identifier: id,
            pilot: pilot,
            title: title,
            club: club,
            glider: glider,
            date: moment.utc(date, 'DD MMM YYYY').toDate(),
            start: start,
            startNum: parseFloat(start || 0),
            finish: finish,
            finishNum: parseFloat(finish || 0),
            duration: duration,
            durationNum: parseFloat(duration || 0),
            takeoff: takeoff,
            landing: landing,
            total: parseFloat(total || 0),
            multiplier: multiplier,
            score: parseFloat(score || 0),
            maxHeight: parseFloat(maxHeight || 0),
            lowHeight: parseFloat(lowHeight || 0),
            takeoffHeight: parseFloat(takeoffHeight || 0),
            maxClimb: parseFloat(maxClimb || 0),
            minClimb: parseFloat(minClimb || 0),
            maxSpeed: parseFloat(maxSpeed || 0),
            avgSpeedCourse: parseFloat(avgSpeedCourse || 0),
            avgSpeedTrack: parseFloat(avgSpeedTrack || 0),
            link: this.url
        }
    
        this.models.push(model);
    }

    get events() {
        return this.eventEmitter;
    }

}
module.exports = Scraper;
