import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { connect } from 'react-redux';
import PrivateLayout from '../../components/Layouts/PrivateLayout';
import GuestLayout from '../../components/Layouts/GuestLayout';
import { PAGE_NOT_FOUND } from '../../constants/wording';

const NotFound = props => (
  <>
    {props.loggedIn ? (
      <PrivateLayout>
        <Card>{PAGE_NOT_FOUND}</Card>
      </PrivateLayout>
    ) : (
      <GuestLayout>
        <Card>{PAGE_NOT_FOUND}</Card>
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
