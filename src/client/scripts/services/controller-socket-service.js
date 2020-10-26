/* global WebSocket */

let socket,
    clientId,
    infoHandler,
    signalHandler,
    exceptionHandler;

const open = (configs, id, onInfo, onSignal, onException) => {
    clientId = id;
    infoHandler = onInfo;
    signalHandler = onSignal;
    exceptionHandler = onException;

    socket = new WebSocket(`${configs['socket-protocol']}://${configs.domain}:${configs['socket-port']}`);

    bindEvents(socket);
};

const bindEvents = s => {
    s.onopen = handlers.onOpenHandler;
    s.onmessage = handlers.onMessageHandler;
    s.onclose = handlers.onCloseHandler;
};

const handlers = {
    onOpenHandler: () => {
        socket.send(JSON.stringify({
            type: 'IDENTIFY',
            clientType: 'controller',
            id: clientId
        }));
    },
    onMessageHandler: message => {
        const receivedMessage = JSON.parse(message.data);

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
    onCloseHandler: () => {
        exceptionHandler('You have been disconnected!');
    }
};

const sendCommand = (command, param) => {
    socket.send(JSON.stringify({
        type: 'COMMAND',
        command: command,
        param: param
    }));
};

const close = () => {
    socket.close();
};

export default {
    open,
    sendCommand,
    close
};
