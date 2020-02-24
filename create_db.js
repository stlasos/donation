const client = require('mongodb').MongoClient;
const getConnectionUrl = require('./server/connection');

client.connect(getConnectionUrl(), function (err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.db().createCollection("donations", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    })
});