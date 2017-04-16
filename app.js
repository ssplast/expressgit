require('./globals');
var express = require('express');
var http = require('http');
var favicon = require('serve-favicon');
var consoleLog = require('./morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var compression = require('compression');

require('./telegram');
require('./rates');


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



