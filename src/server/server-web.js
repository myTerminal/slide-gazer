/* global module require __dirname */

module.exports = function (portNumber) {
    var appName = 'slide-gazer',
        path = require('path'),
        express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        fs = require('fs'),
        baseUrl = path.join(__dirname, '../../');

    app.use(express.static(path.join(baseUrl, 'public')));
    app.use(bodyParser.json());

    app.listen(portNumber, function () {
        console.log(appName, 'web server started on port', portNumber);
    });

    app.get('/configs', function (req, res) {
        res.send(fs.readFileSync(baseUrl + '/configs.json', 'utf8'));
    });

    app.get('*', function (req, res) {
        res.send(fs.readFileSync(baseUrl + '/public/index.html', 'utf8'));
    });
};
