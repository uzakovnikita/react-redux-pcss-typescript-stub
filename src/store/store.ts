import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducer from '../reducers/index';

const middleware = [thunk];

const initStore: {first: boolean} = {
    first: false
};
const store = createStore(reducer, initStore, composeWithDevTools(applyMiddleware(...middleware)));
export default store;