/* global module require __dirname */

const appName = 'slide-gazer';

const path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs');

module.exports = function (portNumber) {
    const app = express(),
        baseUrl = path.join(__dirname, '../../');

    app.use(express.static(path.join(baseUrl, 'public')));
    app.use(bodyParser.json());

    app.listen(portNumber, () => {
        console.log(appName, 'web server started on port', portNumber);
    });

    app.get('/configs', (req, res) => {
        res.send(fs.readFileSync(baseUrl + '/configs.json', 'utf8'));
    });

    app.get('/sample-markdown-file', (req, res) => {
        res.send(fs.readFileSync(baseUrl + '/data/sample-markdown-file.md', 'utf8'));
    });

    app.get('*', (req, res) => {
        res.send(fs.readFileSync(baseUrl + '/public/index.html', 'utf8'));
    });
};
