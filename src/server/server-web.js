/* global module require __dirname */

module.exports = function (configs) {
    var appName = 'slide-gazer',
        path = require('path'),
        express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        fs = require('fs'),
        baseUrl = path.join(__dirname, '../../');

    app.use(express.static(path.join(baseUrl, 'public')));
    app.use(bodyParser.json());

    app.listen(configs['web-port'], function () {
        console.log(appName, 'web server started on port', configs['web-port']);
    });

    app.get("/configs", function (req, res) {
        res.send(configs);
    });

    app.get('*', function (req, res) {
        res.send(fs.readFileSync(baseUrl + '/public/index.html', 'utf8'));
    });
};
