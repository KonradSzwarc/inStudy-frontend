// React
import React from 'react';
import ReactDOM from 'react-dom';

// React Router
import Route from 'react-router-dom/Route';
import Router from 'react-router-dom/Router';
import Switch from 'react-router-dom/Switch';
import createBrowserHistory from 'history/createBrowserHistory';

// Material UI
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// Analitics
import ReactGA from 'react-ga';

// Redux
import Provider from 'react-redux/lib/components/Provider';
import applyMiddleware from 'redux/lib/applyMiddleware';
import createStore from 'redux/lib/createStore';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';

// Views
import Index from './views/Index/Index';
import Hero from './views/Hero/Hero';
import SignIn from './views/SignIn/SignIn';
import SignUp from './views/SignUp/SignUp';
import PasswordRecovery from './views/PasswordRecovery/PasswordRecovery';
import Circles from './views/Circles/Circles';
import PublicProfile from './views/PublicProfile/PublicProfile';
import EditProfile from './views/EditProfile/EditProfile';
import PasswordRecoveryNew from './views/PasswordRecoveryNew/PasswordRecoveryNew';
import ConfirmEmail from './views/ConfirmEmail/ConfirmEmail';
import Error404 from './views/Error404/Error404';
import Instruction from './views/Instruction/Instruction';

import { colorPalette } from './utils/constants/styles';

// Main styles import.
import './scss/global.scss';

// Middleware
/* eslint-disable no-underscore-dangle */
const createStoreWithMiddleware = applyMiddleware(ReduxThunk)(createStore);
const store = createStoreWithMiddleware(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */

// Needed for onTouchTap (Material UI)
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: colorPalette,
  button: {
    height: 50,
    minwidth: 190,
  },
});

ReactGA.initialize('UA-106920408-1');
const customHistory = createBrowserHistory();
customHistory.listen((location) => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <Provider store={store}>
      <Router history={customHistory}>
        <Index>
          <Switch>
            <Route path="/inicjatywy/edit" component={EditProfile} />
            <Route path="/inicjatywy/:url" component={PublicProfile} />
            <Route path="/inicjatywy" component={Circles} />
            <Route path="/odzyskiwanie_hasla/:token" component={PasswordRecoveryNew} />
            <Route path="/odzyskiwanie_hasla" component={PasswordRecovery} />
            <Route path="/potwierdz_email" component={ConfirmEmail} />
            <Route path="/rejestracja" component={SignUp} />
            <Route path="/logowanie" component={SignIn} />
            <Route path="/instrukcja" component={Instruction} />
            <Route path="/" exact component={Hero} />
            <Route component={Error404} />
          </Switch>
        </Index>
      </Router>
    </Provider>
  </MuiThemeProvider>, document.querySelector('.container'));
