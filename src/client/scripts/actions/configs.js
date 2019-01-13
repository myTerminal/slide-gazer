/* global alert */

import axios from 'axios';
import { configs } from '../constants/action-names';

const getDomain = () =>
    (dispatch) => {
        axios.get('/configs').then(response => {
            dispatch({
                type: configs.domain.fetched,
                payLoad: response.data
            });
        }).catch(() => {
            alert('Failed to fetch domain details.');
        });
    };

export default getDomain;
