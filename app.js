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

var cArray = [{
    url: 'http://www.obmenka.kh.ua/',
    logo: 'http://www.obmenka.kh.ua/img/logo.png',
    USD_UAH: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
    },
    EUR_UAH: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
    },
    RUB_UAH: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
    },
    USD_RUB: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
    },
    EUR_USD: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
    }
},{
    url: 'https://kharkov.obmenka.ua/',
    logo: 'https://lh3.googleusercontent.com/QjdODujrvaPeY91_WOE_oKp8gp6IP0A7cSW32x2MGmat5i3neVQB46j5hh_Z__hNlg=w300',
    USD_UAH: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
    },
    EUR_UAH: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
    },
    RUB_UAH: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
    },
    USD_RUB: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
    },
    EUR_USD: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
    }
},{
    url: 'https://kit-group.in.ua/obmenka/',
    logo: 'https://kit-group.in.ua/wp-content/uploads/2016/02/logo.png',
    USD_UAH: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
    },
    EUR_UAH: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
    },
    RUB_UAH: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
    },
    USD_RUB: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
    },
    EUR_USD: {
        prevbuy: 0,
        prevsell: 0,
        buy: 0,
        sell: 0,
        way: 0,
        check: false
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
        request(cArray[0].url, function (error, response, body) {
            if (!error) {
                $ = cheerio.load(body);
                $('div[class="digits"]').find('div[class="item"]').slice(0, 5).each(function (i, elem) {
                    var currname = $(this).find('span[class="val"]').text().replace(/\//g, '_').toUpperCase();
                    cArray[0][currname].buy = $(this).find('span[class="buy"]').text().trim();
                    cArray[0][currname].sell = $(this).find('span[class="sell"]').text().trim();
                    if(cArray[0][currname].buy != cArray[0][currname].prevbuy){
                        if(cArray[0][currname].buy > cArray[0][currname].prevbuy){
                            cArray[0][currname].way = '▲'
                        }else{cArray[0][currname].way = '▼'}
                        cArray[0][currname].check = true;
                        cArray[0][currname].prevbuy = cArray[0][currname].buy;
                        cArray[0][currname].prevsell = cArray[0][currname].sell;
                    }else{cArray[0][currname].check = false}
                });
            }
        });
        request(cArray[1].url, function (error, response, body) {
            if (!error) {// && response && response.statusCode) {
                $ = cheerio.load(body);
                $('ul[class="currency-list"]').find('li[data-rate]').slice(0, 6).each(function (i, elem) {
                    if (i != 3) {
                        var currname = $(this).find('span[class="currency"]').text().replace(/\s/ig, '_');
                        cArray[1][currname].buy = $(this).find('span[class="buy"]').text().trim();
                        cArray[1][currname].sell = $(this).find('span[class="sell"]').text().trim();
                        if(cArray[1][currname].buy != cArray[1][currname].prevbuy){
                            if(cArray[1][currname].buy > cArray[1][currname].prevbuy){
                                cArray[1][currname].way = '▲';
                            }else{cArray[1][currname].way = '▼'}
                            cArray[1][currname].check = true;
                            cArray[1][currname].prevbuy = cArray[1][currname].buy;
                            cArray[1][currname].prevsell = cArray[1][currname].sell;
                        }else{
                            cArray[1][currname].check = false;
                        }
                    }
                });
            }

        });
        request(cArray[2].url, function (error, response, body) {
            if (!error) {
                $ = cheerio.load(body);
                $('#tablo-kharkov').find('div').each(function (i, elem) {
                    //console.log($(this).find('span[class="val"]').text());
                    var currname = $(this).find('span[class="currency"]').text().replace(/usd/ig, 'USD_UAH').replace(/eur/ig, 'EUR_UAH').replace(/rur/ig, 'RUB_UAH');
                    cArray[2][currname].buy = $(this).find('span[class="val"]').text().trim().slice(0,5);
                    cArray[2][currname].sell = $(this).find('span[class="val last-block"]').text().trim().slice(0,5);
                    if(cArray[2][currname].buy != cArray[2][currname].prevbuy){
                        if(cArray[2][currname].buy > cArray[2][currname].prevbuy){
                            cArray[2][currname].way = '▲';
                        }else{cArray[2][currname].way = '▼'}
                        cArray[2][currname].check = true;
                        cArray[2][currname].prevbuy = cArray[2][currname].buy;
                        cArray[2][currname].prevsell = cArray[2][currname].sell;
                    }else{
                        cArray[2][currname].check = false;
                    }
                });
            }
            console.log(cArray);
        });
    },
    start: false,
    timeZone: 'Europe/Kiev'
});
job.start();

