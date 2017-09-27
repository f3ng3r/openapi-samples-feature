import * as actionTypes from './actionTypes';
import _ from 'lodash';

const initialState = {
    accessToken: undefined,
    userData: {},
};

function _updateUserInfo(state, data) {
    return _.assign({}, state, { ...data });
}

export default function(state = initialState, action) {
    switch (action.type) {
        case actionTypes.UPDATE_USER_INFO:
            return _updateUserInfo(state, action);

        default:
            return state;
    }
}
