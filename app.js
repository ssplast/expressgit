require('./globals');
var express = require('express');
var http = require('http');
var favicon = require('serve-favicon');
var consoleLog = require('./morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var compression = require('compression');

var request = require('request');
var htmlParser = require('html-parser');
var cheerio = require("cheerio");
require('./telegram');


var app = express();

var errors = require('./middleware/errors');

app.set('views', path.join(__dirname, 'views', 'ejs'));
app.set('view engine', 'ejs');

//app.disable('x-powered-by');

app.use(compression());

app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use(consoleLog('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({secret: 'keyboard cat', cookie: {maxAge: 60000}, resave: true, saveUninitialized: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/rus', require('./routes/rus'));
app.use('/test', require('./routes/test'));//кнопки
app.use('/bugaltery', require('./routes/bugaltery'));
app.use('/ws', require('./routes/ws'));

app.use(errors.notfound);
app.use(errors.serverError);

var server = http.createServer(app);

server.listen(g.port, function () {
    console.log(g.domain + ':' + g.port);
});

var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
    console.log('ws connection');
    socket.emit('news', {hello: 'world'});
    socket.on('my other event', function (data) {
        console.log(data);
    });
    socket.on('disconnect', function () {
        console.log('ws disconnect');
    });
});

var ccc = [{
    url: 'http://www.obmenka.kh.ua/1',
    logo: '',
    USD_UAH: {
        name: 'USD',
        prevbuy: '',
        prevsell: '',
        buy: '',
        sell: '',
        way: '▼▲'
    },
    EUR_UAH: {
        name: 'EUR',
        prevbuy: '',
        prevsell: '',
        buy: '',
        sell: '',
        way: '▼▲'
    },
    RUB_UAH: {
        name: 'RUB',
        prevbuy: '',
        prevsell: '',
        buy: '',
        sell: '',
        way: '▼▲'
    },
    USD_RUB: {
        name: 'USD-RUB',
        prevbuy: '',
        prevsell: '',
        buy: '',
        sell: '',
        way: '▼▲'
    },
    EUR_USD: {
        name: 'EUR-USD',
        prevbuy: '',
        prevsell: '',
        buy: '',
        sell: '',
        way: '▼▲'
    }
},{
    url: 'http://www.obmenka.kh.ua/2',
    logo: '',
    USD_UAH: {
        name: 'USD',
        prevbuy: '',
        prevsell: '',
        buy: '',
        sell: '',
        way: '▼▲'
    },
    EUR_UAH: {
        name: 'EUR',
        prevbuy: '',
        prevsell: '',
        buy: '',
        sell: '',
        way: '▼▲'
    },
    RUB_UAH: {
        name: 'RUB',
        prevbuy: '',
        prevsell: '',
        buy: '',
        sell: '',
        way: '▼▲'
    },
    USD_RUB: {
        name: 'USD-RUB',
        prevbuy: '',
        prevsell: '',
        buy: '',
        sell: '',
        way: '▼▲'
    },
    EUR_USD: {
        name: 'EUR-USD',
        prevbuy: '',
        prevsell: '',
        buy: '',
        sell: '',
        way: '▼▲'
    }
}];
var CronJob = require('cron').CronJob;
var job = new CronJob({
    /*  Seconds: 0-59
     Minutes: 0-59
     Hours: 0-23
     Day of Month: 1-31
     Months: 0-11
     Day of Week: 0-6    */

    //https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5
    cronTime: '*/5 */1 0-23 1-31 0-11 0-6',
    onTick: function () {
        console.log(moment().format());
        request('http://www.obmenka.kh.ua/', function (error, response, body) {
            if (!error) {
                $ = cheerio.load(body);
                console.log('http://www.obmenka.kh.ua/');
                ccc['http://www.obmenka.kh.ua/']
                $('div[class="digits"]').find('div[class="item"]').each(function (i, elem) {
                    console.log($(this).find('span[class="val"]').text().replace(/\//g, '-').toUpperCase());
                    console.log($(this).find('span[class="buy"]').text());
                    console.log($(this).find('span[class="sell"]').text());
                    //console.log($(this).text().trim().replace(/\ /g, '').replace(/\//g, '-').toUpperCase());
                });
            }
        });
        /*
        request('https://kharkov.obmenka.ua/', function (error, response, body) {
            if (!error) {// && response && response.statusCode) {
                $ = cheerio.load(body);
                $('li[class=" direction"]').slice(0, 3).each(function (i, elem) {
                    $(this).find('span[class="currency"]').text().trim();
                    $(this).find('span[class="buy"]').text().trim();
                    $(this).find('span[class="sell"]').text().trim();
                    console.log($(this).find('span[class="currency"]').text().replace(/\r\n/g, ''));
                    console.log($(this).find('span[class="buy"]').text().replace(/\r|\n/g, ''));
                    console.log($(this).find('span[class="sell"]').text().replace(/\r|\n/g, ''));
                });
            }
        });
        request('https://kit-group.in.ua/obmenka/', function (error, response, body) {
            if (!error) {
                $ = cheerio.load(body);
                $('#tablo-kharkov').slice(0, 3).each(function (i, elem) {
                    console.log($(this).html());
                });
            }
        });
         */
    },
    start: false,
    timeZone: 'Europe/Kiev'
});
job.start();

