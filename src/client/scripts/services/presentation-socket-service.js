/* global WebSocket */

let socket,
    clientId,
    presentationData,
    infoHandler,
    commandHandler,
    exceptionHandler,
    afterOpenCallback;

const open = (configs, id, data, onInfo, onCommand, onException, afterOpen) => {
    clientId = id;
    presentationData = data;
    infoHandler = onInfo;
    commandHandler = onCommand;
    exceptionHandler = onException;
    afterOpenCallback = afterOpen;

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
            clientType: 'presentation',
            id: clientId,
            data: presentationData
        }));

        afterOpenCallback();
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

const sendInfo = (info) => {
    socket.send(JSON.stringify({
        type: 'INFO',
        subType: info
    }));
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
    sendInfo,
    sendSignal,
    close
};
