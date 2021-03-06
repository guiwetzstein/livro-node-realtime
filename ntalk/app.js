const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const consign = require('consign');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const cookie = require('cookie');
const compression = require('compression');
const expressSession = require('express-session');
const methodOverride = require('method-override');
const config = require('./config');
const error = require('./middlewares/error');
const redisAdapter = require('socket.io-redis');
const RedisStore = require('connect-redis')(expressSession);

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const store = new RedisStore(config.redisStore);

app.disable('x-powered-by');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(compression());
app.use(expressSession({
    store,
    name: config.sessionKey,
    secret: config.sessionSecret
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'), config.cache));
app.use(csurf());
app.use((req, res, next) => {
    res.locals._csrf = req.csrfToken();
    next();
});

io.adapter(redisAdapter(config.redis));
io.use((socket, next) => {
    const cookieData = socket.request.headers.cookie;
    const cookieObj = cookie.parse(cookieData);
    const sessionHash = cookieObj[config.sessionKey] || '';
    const sessionID = sessionHash.split('.')[0].slice(2);
    store.get(sessionID, (err, currentSession) => {
        if (err) {
            return next(new Error('Acesso negado!'));
        }
        socket.handshake.session = currentSession;
        return next();
    });
    return true;
});

consign({})
    .include('models')
    .then('controllers')
    .then('routes')
    .then('events')
    .into(app, io);

// middleware de tratamento erros
app.use(error.notFound);
app.use(error.serverError);

server.listen(3000, () => {
    console.log('Ntalk no ar.');
});

module.exports = app;