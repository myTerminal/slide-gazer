/* global module require */

module.exports = function (configs) {
    var ws = require('ws'),
        clients = [],
        wss = new ws.Server({
            perMessageDeflate: false,
            port: configs['socket-port']
        });

    wss.on('connection', function (ws) {
        clients.push({
            ws: ws,
            username: 'anonymous'
        });

        ws.on('message', function (message) {
            var self = this,
                receivedMessage = JSON.parse(message),
                currentClient,
                targetClient;

            switch (receivedMessage.type) {
            case 'IDENTIFY':
                currentClient = clients.filter(c => c.ws === self)[0];

                currentClient.username = receivedMessage.username;

                console.log('user identified:', currentClient.username);

                currentClient.ws.send(JSON.stringify({
                    type: 'USERLIST',
                    users: clients.filter(c => c.ws !== self).map(c => c.username)
                }));

                clients.filter(c => c.ws !== self)
                    .forEach(c => c.ws.send(JSON.stringify({
                        type: 'USERENTERED',
                        username: currentClient.username
                    })));

                break;

            case 'MESSAGE':
                currentClient = clients.filter(c => c.ws === self)[0];

                targetClient = clients.filter(c => c.username === receivedMessage.targetUsername)[0];

                targetClient.ws.send(JSON.stringify({
                    type: 'MESSAGE',
                    fromUsername: currentClient.username,
                    messageText: receivedMessage.messageText
                }));

                break;

            default:
                // Do nothing
            }
        });

        ws.on('close', function () {
            var self = this,
                currentClient = clients.filter(c => c.ws === self)[0],
                index = clients.indexOf(currentClient);

            clients.splice(index, 1);

            clients.forEach(c => c.ws.send(JSON.stringify({
                type: 'USERLEFT',
                username: currentClient.username
            })));

            console.log('connection closed by', currentClient.username);
        });
    });

    console.log('slide-gazer socket server started on port', configs['socket-port']);
};
