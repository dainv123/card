import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Formik, Field } from 'formik';
import { Form, Icon, Input, Button, Checkbox, Card, Avatar } from 'antd';
import { FormInputField } from '../FormInputField/FormInputField';
import validators from '../../validators/validators';
import { mutations } from '../../graphql/graphql';
import EmailSent from '../EmailSent/EmailSent';
import _s from './RegisterForm.less';
import { AGREE_LOGIN, ALREADY_HAVE_ACCOUNT, CONFIRM_PASSWORD, EMAIL, EMAIL_HAS_ALREADY, LOG_IN, NAME, PASSWORD, REGISTER, USERNAME, USERNAME_HAS_ALREADY } from '../../constants/wording';
import { COLOR_BLACK_1 } from '../../constants/common';
import { UserAddOutlined } from '@ant-design/icons';
import { IdcardOutlined } from '@ant-design/icons';
import { MailOutlined } from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';
import { LockOutlined } from '@ant-design/icons';

const RegisterForm = props => {
  const [registeredEmail, setRegisteredEmail] = useState();

  const [SignUp] = useMutation(mutations.SIGN_UP);

  const handleSubmitForm = async (values, actions) => {
    const { email, password, name, username } = values;

    const { setErrors, setSubmitting } = actions;

    SignUp({ variables: { email, password, name, username } }).then(
      res => {
        setRegisteredEmail(email);
      },
      err => {
        const errors = {};
        err.graphQLErrors.map(x => {
          if (x.message.includes('email')) {
            errors.email = EMAIL_HAS_ALREADY;
          }
          if (x.message.includes('username')) {
            errors.username = USERNAME_HAS_ALREADY;
          }
        });
        setSubmitting(false);
        setErrors(errors);
      }
    );
  };

  if (registeredEmail) {
    return <EmailSent email={registeredEmail} />;
  } else {
    return (
      <Card className={_s.RegisterFormCard}>
        <p style={{ fontWeight: 'bold', fontSize: '1.05rem', textAlign: 'center' }}>
          <UserAddOutlined style={{ paddingRight: '5px' }} /> {REGISTER}
        </p>
        <Formik
          initialValues={{
            name: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            terms: false
          }}
          validateOnBlur={false}
          validationSchema={validators.user.registerSchema}
          onSubmit={(values, actions) => handleSubmitForm(values, actions)}
          render={formikProps => {
            const { isSubmitting, handleSubmit } = formikProps;

            return (
              <Form onSubmit={handleSubmit}>
                <Field
                  InputType={Input}
                  component={FormInputField}
                  prefix={<UserOutlined style={{ color: COLOR_BLACK_1 }} />}
                  name="username"
                  placeholder={USERNAME}
                  hasFeedback
                />
                <Field
                  InputType={Input}
                  component={FormInputField}
                  prefix={<IdcardOutlined style={{ color: COLOR_BLACK_1 }} />}
                  name="name"
                  placeholder={NAME}
                  hasFeedback
                />
                <Field
                  InputType={Input}
                  component={FormInputField}
                  prefix={<MailOutlined style={{ color: COLOR_BLACK_1 }} />}
                  name="email"
                  placeholder={EMAIL}
                  hasFeedback
                />
                <Field
                  InputType={Input.Password}
                  component={FormInputField}
                  prefix={<LockOutlined style={{ color: COLOR_BLACK_1 }} />}
                  name="password"
                  placeholder={PASSWORD}
                  hasFeedback
                />
                <Field
                  InputType={Input.Password}
                  component={FormInputField}
                  prefix={<LockOutlined style={{ color: COLOR_BLACK_1 }} />}
                  name="confirmPassword"
                  placeholder={CONFIRM_PASSWORD}
                  hasFeedback
                />
                <Field InputType={Checkbox} component={FormInputField} name="terms">
                  {AGREE_LOGIN}
                </Field>

                <Form.Item style={{ marginBottom: 'unset' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    className={_s.RegisterFormButton}
                  >
                    {REGISTER}
                  </Button>
                  <span>
                    {ALREADY_HAVE_ACCOUNT} <Link to="/login">{LOG_IN}</Link>
                  </span>
                </Form.Item>
              </Form>
            );
          }}
        />
      </Card>
    );
  }
};

export default RegisterForm;
