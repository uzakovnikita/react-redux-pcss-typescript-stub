import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/app/app';
import store from './store/store';

const mountNode = document.getElementById('app');
const Application = () => (
    <Provider store={ store }>
        <App />
    </Provider>
);


ReactDOM.render(
    Application(),
    mountNode
);