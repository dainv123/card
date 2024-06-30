import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { mutations } from '../../graphql/graphql';
import actions from '../../store/actions/actions';
import Loading from '../Loading/Loading';

const CheckIfLoggedIn = props => {
  if (props.firstAuthValidationDone) return props.children;

  const [authCheckDone, setAuthCheckDone] = useState(false);

  const [CheckIfLoggedIn, { data, loading, error }] = useMutation(mutations.VERIFY_LOGGED_IN);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await CheckIfLoggedIn();
      } catch (error) {
        props.setFirstAuthState(false, null);
      } finally {
        setAuthCheckDone(true);
      }
    };

    fetchData();
  }, []);

  if (!authCheckDone || loading) {
    return <Loading />;
  }

  if (data) {
    props.setFirstAuthState(true, data.CheckIfLoggedIn);
    // console.log('Did First Auth Validation');
  }

  if (error) {
    props.setFirstAuthState(false, null);
    // console.log('Did First Auth Validation');
  }

  return props.children;
};

const mapStateToProps = state => {
  return {
    firstAuthValidationDone: state.auth.firstAuthValidationDone
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setFirstAuthState: actions.setFirstAuthState
    },
    dispatch
  );
};

CheckIfLoggedIn.propTypes = {
  firstAuthValidationDone: PropTypes.bool.isRequired,
  setFirstAuthState: PropTypes.func.isRequired
};

const connectedCheckIfLoggedIn = connect(mapStateToProps, mapDispatchToProps)(CheckIfLoggedIn);

export default connectedCheckIfLoggedIn;
