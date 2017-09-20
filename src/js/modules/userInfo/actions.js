import * as actionTypes from './actionTypes';
import * as loaderActions from '../loader/actions';
import * as errorActions from '../error/actions';
import { getUserDetails } from '../../utils/api';

export function updateUserInfo(accessToken, userData) {
    return { type: actionTypes.UPDATE_USER_INFO, accessToken, userData };
}

export function getUser(accessToken) {
    return (dispatch, getStore) => {
        dispatch(loaderActions.showLoader());
        dispatch(errorActions.hideError());
        getUserDetails(accessToken)
        .then((result) => dispatch(updateUserInfo(accessToken, result.response)))
        .catch((err) => dispatch(errorActions.showError()))
        .then(() => dispatch(loaderActions.hideLoader()));
    }
}