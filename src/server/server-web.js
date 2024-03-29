/* global module require __dirname */

const appName = 'slide-gazer';

const path = require('path');
const request = require('request');
const https = require('https');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');

const configs = require('../../configs');

const fetchRemoteMarkdownFile = fileUrl =>
    new Promise((resolve, reject) => {
        // Check if the file extension is not markdown
        if (fileUrl.split('').reverse().join('').indexOf('dm') !== 0) {
            // Reject until more file extensions are supported
            reject('Only markdown files are supported at the moment.');
        }

        // Check if the link if from GitHub and not a raw file
        if ((fileUrl.indexOf('https://github.com') > -1) && (fileUrl.indexOf('/blob/') > -1)) {
            // Construct the raw file path for the file
            fileUrl = fileUrl
                .replace('github.com', 'raw.githubusercontent.com')
                .replace('/blob/', '/');
        }

        request(
            fileUrl,
            (error, response, body) => {
                // Reject in case of an error
                if (error || (response && response.statusCode === 400)) {
                    reject(error);
                }

                // Send the file body text
                resolve({
                    remotePath: fileUrl,
                    content: body
                });
            });
    });

module.exports = portNumber => {
    const app = express();
    const baseUrl = path.join(__dirname, '../../');

    app.use(express.static(path.join(baseUrl, 'public')));
    app.use(bodyParser.json());

    app.get(
        '/configs',
        (req, res) => {
            res.send(
                fs.readFileSync(baseUrl + '/configs.json', 'utf8')
            );
        }
    );

    app.post(
        '/load-remote-presentation',
        (req, res) => {
            fetchRemoteMarkdownFile(req.body.url)
                .then(info => {
                    res.send(info);
                })
                .catch(error => {
                    res.status(400);
                    res.send(error);
                });
        }
    );

    app.get(
        '/sample-markdown-file',
        (req, res) => {
            res.send(
                fs.readFileSync(baseUrl + '/data/sample-markdown-file.md', 'utf8')
            );
        }
    );

    app.get(
        '*',
        (req, res) => {
            const { headers, url } = req;

            res.send(
                fs.readFileSync(baseUrl + '/public/index.html', 'utf8')
            );
        }
    );

    if (configs['ssl-cert-path']) {
        const server = https.createServer(
            {
                key: fs.readFileSync(`${configs['ssl-cert-path']}/privkey.pem`),
                cert: fs.readFileSync(`${configs['ssl-cert-path']}/fullchain.pem`)
            },
            app
        );

        server.listen(
            portNumber,
            () => {
                console.log(appName, 'web server started on port', portNumber);
            }
        );
    } else {
        app.listen(
            portNumber,
            () => {
                console.log(appName, 'web server started on port', portNumber);
            }
        );
    }
};
