import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.js';
import { render } from 'react-dom';

render(
  <div className='app'>
    <App/>
  </div>,
  document.getElementById('app')
);