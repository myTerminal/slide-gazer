/* global module require setInterval */

module.exports = function (portNumber) {
    var ws = require('ws'),
        clients = [],
        pingInterval,
        noOperation = function () {},
        wss = new ws.Server({
            perMessageDeflate: false,
            port: portNumber
        });

    wss.on('connection', function (ws) {
        ws.isAlive = true;

        ws.on('pong', function () {
            this.isAlive = true;
        });

        clients.push({
            ws: ws,
            clientType: 'unknown',
            id: 'unknown'
        });

        ws.on('message', function (message) {
            var self = this,
                receivedMessage = JSON.parse(message),
                currentClient,
                targetClient;

            switch (receivedMessage.type) {
            case 'IDENTIFY':
                // Find the current client in the list of connected clients
                currentClient = clients.filter(c => c.ws === self)[0];

                // Determine whether the client is a presentation or a controller
                currentClient.clientType = receivedMessage.clientType;

                // Set the id for current client
                currentClient.id = receivedMessage.id.toString();

                if (currentClient.clientType === 'presentation') {
                    // Store presentation data
                    currentClient.data = receivedMessage.data;

                    console.log('Presentation started:', currentClient.id);
                } else {
                    // Check if a controller is already connected
                    if (clients.filter(c => c.clientType === 'controller' && c.id === currentClient.id).length > 1) {
                        // Remove the controller from the list of clients
                        clients.splice(clients.indexOf(currentClient), 1);

                        // Send the controller an exception
                        currentClient.ws.send(JSON.stringify({
                            type: 'INFO',
                            subType: 'DUPLICATE'
                        }));

                        // Close connection
                        self.close();

                        // Log information to the console and stop processing
                        console.log('Redundant controller ' + currentClient.id + ' attempted to connect.');
                        return;
                    }


                    // Find the corresponding presentation
                    targetClient = clients.filter(c => c.clientType === 'presentation' && c.id === currentClient.id)[0];

                    if (targetClient) { // If a presentation is found
                        // Send presentation data to controller
                        currentClient.ws.send(JSON.stringify({
                            type: 'INFO',
                            subType: 'DATA',
                            data: targetClient.data
                        }));

                        // Inform presentation that a controller is connected
                        targetClient.ws.send(JSON.stringify({
                            type: 'INFO',
                            subType: 'CONNECTION'
                        }));

                        console.log('Controller connected:', currentClient.id);
                    } else { // If no presentation is found
                        // Inform controller that no presentation was found
                        currentClient.ws.send(JSON.stringify({
                            type: 'INFO',
                            subType: 'NO-PRESENTATION'
                        }));
                    }
                }

                break;

            case 'COMMAND':
                // Find the current client in the list of connected clients
                currentClient = clients.filter(c => c.ws === self)[0];

                // Find the corresponding presentation
                targetClient = clients.filter(c => c.clientType === 'presentation' && c.id === currentClient.id)[0];

                if (targetClient) {
                    targetClient.ws.send(JSON.stringify({
                        type: 'COMMAND',
                        command: receivedMessage.command,
                        param: receivedMessage.param
                    }));
                }

                break;

            case 'SIGNAL':
                // Find the current client in the list of connected clients
                currentClient = clients.filter(c => c.ws === self)[0];

                // Find the corresponding controller
                targetClient = clients.filter(c => c.clientType === 'controller' && c.id === currentClient.id)[0];

                if (targetClient) {
                    targetClient.ws.send(JSON.stringify({
                        type: 'SIGNAL',
                        signal: receivedMessage.signal,
                        data: receivedMessage.data
                    }));
                }

                break;

            default:
                // Do nothing
            }
        });

        ws.on('error', function () {
            // Do nothing
        });

        ws.on('close', function () {
            var self = this,
                currentClient = clients.filter(c => c.ws === self)[0],
                index = clients.indexOf(currentClient),
                pairedClient;

            // Check if it is a redundant client
            if (index === -1) {
                console.log('Redundant client disconnected');
                return;
            }

            // Remove the disconnected client from the list
            clients.splice(index, 1);

            if (currentClient.clientType === 'presentation') {
                // Find the corressponding controller
                pairedClient = clients.filter(c => c.clientType === 'controller' && c.id === currentClient.id)[0];

                if (pairedClient) {
                    // Communicate that the presentation has ended
                    pairedClient.ws.send(JSON.stringify({
                        type: 'INFO',
                        subType: 'DISCONNECTION'
                    }));

                    pairedClient.ws.close();
                }

                console.log('Presentation ended:', currentClient.id);
            } else {
                // Find the corressponding presentation
                pairedClient = clients.filter(c => c.clientType === 'presentation' && c.id === currentClient.id)[0];

                if (pairedClient) {
                    // Communicate that the controller has disconnected
                    pairedClient.ws.send(JSON.stringify({
                        type: 'INFO',
                        subType: 'DISCONNECTION'
                    }));
                }

                console.log('Controller disconnected:', currentClient.id);
            }
        });
    });

    pingInterval = setInterval(function ping() {
        clients
            .map(c => c.ws)
            .forEach(ws => {
                if (!ws.isAlive) {
                    return ws.terminate();
                }

                ws.isAlive = false;
                ws.ping(noOperation);
            });
    }, 30000);

    console.log('slide-gazer socket server started on port', portNumber);
};
