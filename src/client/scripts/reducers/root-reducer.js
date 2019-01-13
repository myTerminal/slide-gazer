import { combineReducers } from 'redux';

import configsReducer from './configs-reducer';
import presentationReducer from './presentation-reducer';
import controllerReducer from './controller-reducer';

const rootReducer = combineReducers({
    configs: configsReducer,
    presentation: presentationReducer,
    controller: controllerReducer
});

export default rootReducer;
