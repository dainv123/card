import React from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import GuestRoute from './components/GuestRoute/GuestRoute';
import CheckIfLoggedIn from './components/CheckIfLoggedIn/CheckIfLoggedIn';
import LoginPage from './pages/Login/Login';
import RegisterPage from './pages/Register/Register';
import HomePage from './pages/Home/Home';
import AboutMePage from './pages/AboutMe/AboutMe';
import ThemePage from './pages/Theme/Theme';
import BlogPage from './pages/Blog/Blog';
import BlogDetailPage from './pages/Blog/BlogDetail';
import ContactPage from './pages/Contact/Contact';
import ReaderPage from './pages/Reader/Reader';
import VerifyTokenPage from './pages/VerifyToken/VerifyToken';
import DashboardPage from './pages/Dashboard/Dashboard';
import ProfilePage from './pages/Profile/Profile';
import PageNotFound from './pages/NotFound/NotFound';

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
          <Route exact path="/verify-token/:token" component={VerifyTokenPage} />
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
