import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import HelpContainerComponent from './Components/HelpContainerComponent'
import * as serviceWorker from './serviceWorker';
import { Route, Link, HashRouter as Router, Switch } from 'react-router-dom'

ReactDOM.render(
  
  <React.StrictMode>
    <Router basename='/'>
      <Switch>
        <Route path="/help">
          <HelpContainerComponent />
        </Route>
        {/* The default route */}
        <Route path="/">
          <App />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
