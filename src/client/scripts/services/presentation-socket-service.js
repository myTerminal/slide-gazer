/* global WebSocket */

const presentationSocketService = (function () {
    var self = this,
        socket,
        clientId,
        presentationData,
        infoHandler,
        commandHandler,
        exceptionHandler,

        open = function (configs, id, data, onInfo, onCommand, onException) {
            clientId = id;
            presentationData = data;
            infoHandler = onInfo;
            commandHandler = onCommand;
            exceptionHandler = onException;

            socket = new WebSocket('ws://'
                                   + configs.domain
                                   + ':'
                                   + configs['socket-port']);

            bindEvents(socket);
        },

        bindEvents = function (s) {
            s.onopen = handlers.onOpenHandler;
            s.onmessage = handlers.onMessageHandler;
            s.onclose = handlers.onCloseHandler;
        },

        handlers = {
            onOpenHandler: function () {
                socket.send(JSON.stringify({
                    type: 'IDENTIFY',
                    clientType: 'presentation',
                    id: clientId,
                    data: presentationData
                }));
            },
            onMessageHandler: function (message) {
                var receivedMessage = JSON.parse(message.data);

                switch (receivedMessage.type) {
                case 'INFO':
                    infoHandler(receivedMessage.subType);
                    break;

                case 'COMMAND':
                    commandHandler(receivedMessage.command, receivedMessage.param);
                    break;

                default:
                    // Do nothing
                }
            },
            onCloseHandler: function () {
                exceptionHandler('Connection to server has been lost!');
            }
        },

        sendSignal = function (signal, data) {
            socket.send(JSON.stringify({
                type: 'SIGNAL',
                signal: signal,
                data: data
            }));
        },

        close = function () {
            socket.close();
        };

    return {
        open: open,
        sendSignal: sendSignal,
        close: close
    };
})();

export default presentationSocketService;
