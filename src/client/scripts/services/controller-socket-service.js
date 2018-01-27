/* global WebSocket */

const controllerSocketService = (function () {
    var self = this,
        socket,
        clientId,
        infoHandler,
        signalHandler,
        exceptionHandler,

        open = function (configs, id, onInfo, onSignal, onException) {
            clientId = id;
            infoHandler = onInfo;
            signalHandler = onSignal,
            exceptionHandler = onException;

            socket = new WebSocket('ws://'
                                   + configs['domain']
                                   + ':'
                                   + configs['socket-port']);

            bindEvents(socket);
        },

        bindEvents = function (socket) {
            socket.onopen = handlers.onOpenHandler;
            socket.onmessage = handlers.onMessageHandler;
            socket.onclose = handlers.onCloseHandler;
        },

        handlers = {
            onOpenHandler: function () {
                socket.send(JSON.stringify({
                    type: 'IDENTIFY',
                    clientType: 'controller',
                    id: clientId
                }));
            },
            onMessageHandler: function (message) {
                var receivedMessage = JSON.parse(message.data);

                switch (receivedMessage.type) {
                case 'INFO':
                    infoHandler(receivedMessage.subType, receivedMessage.data);
                    break;

                case 'SIGNAL':
                    signalHandler(receivedMessage.signal, receivedMessage.data);
                    break;

                default:
                    // Do nothing
                }
            },
            onCloseHandler: function () {
                exceptionHandler('You have been disconnected!');
            }
        },

        sendCommand = function (command, param) {
            socket.send(JSON.stringify({
                type: 'COMMAND',
                command: command,
                param: param
            }));
        },

        close = function () {
            socket.close();
        };

    return {
        open: open,
        sendCommand: sendCommand,
        close: close
    };
})();

export default controllerSocketService;
