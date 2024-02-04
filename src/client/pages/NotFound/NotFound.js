import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { connect } from 'react-redux';

import PrivateLayout from '../../components/Layouts/PrivateLayout';
import GuestLayout from '../../components/Layouts/GuestLayout';

// import _s from './Dashboard.less';

const NotFound = props => (
  <>
    {props.loggedIn ? (
      <PrivateLayout>
        <Card>404 - Page Not Found</Card>
      </PrivateLayout>
    ) : (
      <GuestLayout>
        <Card>404 - Page Not Found</Card>
      </GuestLayout>
    )}
  </>
);

const mapStateToProps = state => {
  return {
    loggedIn: state.auth.loggedIn
  };
};

NotFound.propTypes = {
  loggedIn: PropTypes.bool.isRequired
};

const connectedNotFound = connect(mapStateToProps)(NotFound);

export default connectedNotFound;
