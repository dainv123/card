import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Formik, Field } from 'formik';
import { Form, Icon, Input, Button, Checkbox, Card, Alert, message } from 'antd';
import { FormInputField } from '../FormInputField/FormInputField';
import validators from '../../validators/validators';
import actions from '../../store/actions/actions';
import { mutations } from '../../graphql/graphql';
import { EMAIL, FORGOT_PASSWORD, INCORRECT_EMAIL_PASSWORD, LOGGED_IN_SUCCESSFULLY, LOG_IN, OR, PASSWORD, REGISTER_NOW, REMEMBER_ME } from '../../constants/wording';
import _s from './LoginForm.less';
import { COLOR_BLACK_1 } from '../../constants/common';
import { MailOutlined } from '@ant-design/icons';
import { LockOutlined } from '@ant-design/icons';
import { LoginOutlined } from '@ant-design/icons';

const LoginForm = props => {
  const [LogIn] = useMutation(mutations.LOG_IN);

  const handleSubmitForm = async (values, actions) => {
    const { email, password } = values;

    const { setErrors, setSubmitting } = actions;

    LogIn({ variables: { email, password } }).then(
      res => {
        props.setAuthUser(res.data.LogIn);
        message.success(LOGGED_IN_SUCCESSFULLY);
      },
      err => {
        setSubmitting(false);
        err.graphQLErrors.map(x => {
          console.log(x.message);
          // TODO NOT VERIFIED MESSAGE
          // if (x.message.includes('email')) errors.email = 'Email has already been taken.';
          // if (x.message.includes('username')) errors.username = 'Username has already been taken.';
        });
        setErrors({ auth: INCORRECT_EMAIL_PASSWORD });
      }
    );
  };

  return (
    <Card className={_s.LoginFormCard}>
      <p style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>
        <LoginOutlined style={{ paddingRight: '5px' }} /> {LOG_IN}
      </p>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validators.user.loginSchema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={(values, actions) => handleSubmitForm(values, actions)}
        render={formikProps => {
          const { errors, isSubmitting, handleSubmit } = formikProps;

          return (
            <>
              {Object.keys(errors).length > 0 && (
                <Alert
                  message={errors.email || errors.password || errors.auth}
                  type="error"
                  showIcon
                  style={{ marginBottom: '1.05rem', maxWidth: '300px' }}
                />
              )}
              <Form onSubmit={handleSubmit}>
                <Field
                  InputType={Input}
                  component={FormInputField}
                  prefix={<MailOutlined style={{ color: COLOR_BLACK_1 }} />}
                  name="email"
                  placeholder={EMAIL}
                  hideErrorMessage={true}
                />
                <Field
                  InputType={Input}
                  component={FormInputField}
                  prefix={<LockOutlined style={{ color: COLOR_BLACK_1 }} />}
                  name="password"
                  placeholder={PASSWORD}
                  type="password"
                  hideErrorMessage={true}
                />
                <Form.Item style={{ marginBottom: 'unset' }}>
                  <Checkbox>{REMEMBER_ME}</Checkbox>
                  <a className={_s.loginFormForgot} href="/contact">
                    {FORGOT_PASSWORD}
                  </a>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    className={_s.loginFormButton}
                  >
                    {LOG_IN}
                  </Button>
                  {OR} <Link to="/register">{REGISTER_NOW}</Link>
                </Form.Item>
              </Form>
            </>
          );
        }}
      />
    </Card>
  );
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loggedIn: state.auth.loggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setAuthUser: actions.setAuthUser
    },
    dispatch
  );
};

LoginForm.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  setAuthUser: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
