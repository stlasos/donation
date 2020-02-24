const dbconf = require('../dbconf.json');

const getConnectionUrl = function () {
    let url = '';

    let host = (dbconf.host !== "") ? dbconf.host : "localhost"
    let name = (dbconf.name !== "") ? dbconf.name : "test"
    let port = (dbconf.port !== "") ? dbconf.port : "27017"

    if (dbconf.user !== "") {
        url = "mongodb://" + dbconf.user + ":" + dbconf.password + "@" + host + ":" + port + "/" + name;
    } else {
        url = "mongodb://" + host + ":" + port + "/" + name;
    }

    return url;
}

module.exports = getConnectionUrl;