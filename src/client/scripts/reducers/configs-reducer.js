import { configs } from '../constants/action-names';

const initialState = {
    origin: '/',
    domain: 'slide-gazer.myterminal.me',
    'web-port': '8089',
    'socket-port': '8090'
};

const configsReducer = (state = initialState, action) => {
    switch (action.type) {
    case configs.domain.fetched:
        return {
            ...action.payLoad
        };
    default:
        return state;
    }
};

export default configsReducer;
