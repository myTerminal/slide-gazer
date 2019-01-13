/* global WebSocket */

let socket,
    clientId,
    presentationData,
    infoHandler,
    commandHandler,
    exceptionHandler;

const open = (configs, id, data, onInfo, onCommand, onException) => {
    clientId = id;
    presentationData = data;
    infoHandler = onInfo;
    commandHandler = onCommand;
    exceptionHandler = onException;

    socket = new WebSocket(`ws://${configs.domain}:${configs['socket-port']}`);

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
            clientType: 'presentation',
            id: clientId,
            data: presentationData
        }));
    },
    onMessageHandler: message => {
        const receivedMessage = JSON.parse(message.data);

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
    onCloseHandler: () => {
        exceptionHandler('Connection to server has been lost!');
    }
};

const sendSignal = (signal, data) => {
    socket.send(JSON.stringify({
        type: 'SIGNAL',
        signal: signal,
        data: data
    }));
};

const close = () => {
    socket.close();
};

export default {
    open,
    sendSignal,
    close
};
