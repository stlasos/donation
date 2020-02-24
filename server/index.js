'use strict';
const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
const Router = require('koa-router');
const fs = require('fs');
const util = require('util');
const path = require('path');
const readFile = util.promisify(fs.readFile);
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const getConnectionUrl = require('./connection');
const bodyParser = require('koa-bodyparser');
let mongoConnection;
mongoClient.connect(getConnectionUrl(), (err, db) => {
    if (err) throw err;
    mongoConnection = db;
});

const app = new Koa(),
    port = 3000;

const router = new Router()

router.get('/', async (ctx) => {
    ctx.set('Content-Type', 'text/html');
    ctx.body = await readFile(path.join(__dirname, '../index.html'));
});

router.get('/get-data', (ctx) => {
    const presets = [40, 100, 200, 1000, 2500, 5000];
    const suggestion = 40;

    const currencies = [
        { name: "US Dollar", code: "USD", symbol: "$", rate: 1 },
        { name: "Euro", code: "EUR", symbol: "€", rate: 0.897597 },
        { name: "British Pound", code: "GBP", symbol: "£", rate: 0.81755 },
        { name: "Russian Ruble", code: "RUB", symbol: "₽", rate: 63.461993 }
    ];
    ctx.set('Content-Type', 'application/json');
    ctx.body = {
        presets: presets,
        suggestion: suggestion,
        currencies: currencies
    }
});

router.post('/donate', async (ctx) => {
    await mongoConnection.db().collection('donations').insertOne({
        amount: ctx.request.body.amount,
        currency: ctx.request.body.currency
    });
    ctx.set('Content-Type', 'application/json');
    ctx.body = {
        ok: true
    }
});

app.use(bodyParser());

app.use(mount('/public', serve(path.join(__dirname, '../public'))));

app.use(router.routes())
    .use(router.allowedMethods());

app.listen(port, () => {
    console.log('Server Started -', 'http://localhost:' + port.toString());
});