import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../constants/actions';


const firstReducer = handleActions({
    [actions.firstAction.toString()] () {
        return true;
    }
}, false);
export default combineReducers({
    first: firstReducer
})