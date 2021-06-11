import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import {applyMiddleware, createStore} from 'redux'
import {Provider} from 'react-redux'
import mainReducer from './redux/reducers/mainReducer'
import thunk from 'redux-thunk'
import './scss/app.scss'


const reduxStore = createStore(mainReducer,applyMiddleware(thunk))

ReactDOM.render(
  <Provider store={reduxStore}>
    <App />
  </Provider>,
  document.getElementById('root')
);