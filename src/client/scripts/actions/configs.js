import axios from 'axios';
import { alert } from 'ample-alerts';
import { configs } from '../constants/action-names';

const getDomain = () =>
    (dispatch) => {
        axios.get('/configs').then(response => {
            dispatch({
                type: configs.domain.fetched,
                payLoad: response.data
            });
        }).catch(() => {
            alert(['Error!', 'Failed to fetch domain details.']);
        });
    };

export default getDomain;
