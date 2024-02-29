import React from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute.js';
import GuestRoute from './components/GuestRoute/GuestRoute.js';
import CheckIfLoggedIn from './components/CheckIfLoggedIn/CheckIfLoggedIn.js';
import LoginPage from './pages/Login/Login.js';
import RegisterPage from './pages/Register/Register.js';
import HomePage from './pages/Home/Home.js';
import AboutMePage from './pages/AboutMe/AboutMe.js';
import ThemePage from './pages/Theme/Theme.js';
import BlogPage from './pages/Blog/Blog.js';
import BlogDetailPage from './pages/Blog/BlogDetail.js';
import ContactPage from './pages/Contact/Contact.js';
import ReaderPage from './pages/Reader/Reader.js';
import DashboardPage from './pages/Dashboard/Dashboard.js';
import ProfilePage from './pages/Profile/Profile.js';
import PageNotFound from './pages/NotFound/NotFound.js';

const App = props => {
  return (
    <ConnectedRouter history={props.history}>
      <CheckIfLoggedIn>
        <Switch>
          <PrivateRoute exact path="/admin" component={DashboardPage} />
          <PrivateRoute exact path="/admin/profile" component={ProfilePage} />
          <GuestRoute exact path="/login" component={LoginPage} />
          <GuestRoute exact path="/register" component={RegisterPage} />
          <Route exact path="/" component={HomePage} />
          <Route exact path="/about-me" component={AboutMePage} />
          <Route exact path="/theme" component={ThemePage} />
          <Route exact path="/blog" component={BlogPage} />
          <Route exact path="/blog/:id" component={BlogDetailPage} />
          <Route exact path="/contact" component={ContactPage} />
          <Route exact path="/reader/:id?" component={ReaderPage} />
          <Route component={PageNotFound} />
        </Switch>
      </CheckIfLoggedIn>
    </ConnectedRouter>
  );
};

App.propTypes = {
  history: PropTypes.object
};

export default App;
