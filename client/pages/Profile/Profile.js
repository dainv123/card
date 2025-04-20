import React, { useState, useEffect, useRef } from 'react';
import { mutations } from '../../graphql/graphql';
import { useMutation } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Formik, Field } from 'formik';
import { Layout, Icon, Input, Button, Row, Card, message } from 'antd';
import actions from '../../store/actions/actions';
import validators from '../../validators/validators';
import PrivateLayout from '../../components/Layouts/PrivateLayout';
import { FormInputField } from '../../components/FormInputField/FormInputField';
import { EDIT, EMAIL, NAME, PROFILE, SAVE, SUBMIT, UNDO, UPDATE_USER_SUCCESSFULLy, USER_NAME } from '../../constants/wording';
import _s from './Profile.less';
import { COLOR_BLACK_1 } from '../../constants/common';
import { UserAddOutlined } from '@ant-design/icons';
import { IdcardOutlined } from '@ant-design/icons';
import { MailOutlined } from '@ant-design/icons';

const ProfilePage = ({ data = {} }) => {
  const user = useSelector(state => state.auth.user);

  const dispatch = useDispatch();

  const setAuthUser = actions.setAuthUser;

  const formmilkRef = useRef(null);

  const hiddenInnerSubmitFormRef = useRef(null);

  const [value, setValue] = useState({});

  const [isEdit, setIsEdit] = useState(false);

  const [UpdateUser] = useMutation(mutations.UPDATE_USER);

  const handleUnde = () => {
    formmilkRef.current.setValues(user);
    formmilkRef.current.setErrors({});
    setIsEdit(false);
  };

  const handleSubmitForm = async ({ name, username, email }, { setErrors, setSubmitting }) => {
    UpdateUser({ variables: { name, username, email } }).then(
      res => {
        setIsEdit(false);
        dispatch(setAuthUser({ ...user, name, username, email }));
        message.info(UPDATE_USER_SUCCESSFULLy);
      },
      err => {
        const errors = {};
        err.graphQLErrors.map(x => {
          if (x.message.includes('name')) {
            errors.name = x.message.includes('name');
          }
        });
        err.graphQLErrors.map(x => {
          if (x.message.includes('username')) {
            errors.username = x.message.includes('username');
          }
        });
        err.graphQLErrors.map(x => {
          if (x.message.includes('email')) {
            errors.email = x.message.includes('email');
          }
        });
        setSubmitting(false);
        setErrors(errors);
      }
    );
  };

  useEffect(() => {
    if (JSON.stringify(user) != JSON.stringify(value)) {
      setValue(user);
    }
  }, [user]);

  return (
    <PrivateLayout>
      <Layout.Content>
        <div className={_s.container}>
          <Card className={_s.RegisterFormCard}>
            <p style={{ fontWeight: 'bold', fontSize: '1.05rem', textAlign: 'center' }}>
              <UserAddOutlined style={{ paddingRight: '5px' }} />
              {PROFILE}
            </p>
            <Row>
              <Formik
                ref={formmilkRef}
                validateOnBlur={false}
                enableReinitialize={true}
                validationSchema={validators.user.updateSchema}
                onSubmit={(values, actions) => handleSubmitForm(values, actions)}
                initialValues={{
                  name: value.name || '',
                  email: value.email || '',
                  username: value.username || '',
                }}
              >
                <Form>
                  <button type="submit" style={{ display: 'none' }} ref={hiddenInnerSubmitFormRef}>
                    {SUBMIT}
                  </button>
                  <Field
                    InputType={Input}
                    component={FormInputField}
                    prefix={<IdcardOutlined style={{ color: COLOR_BLACK_1 }} />}
                    name="name"
                    placeholder={NAME}
                    disabled={!isEdit}
                    hasFeedback
                  />
                  <Field
                    InputType={Input}
                    component={FormInputField}
                    prefix={<IdcardOutlined style={{ color: COLOR_BLACK_1 }} />}
                    name="username"
                    placeholder={USER_NAME}
                    disabled={!isEdit}
                    hasFeedback
                  />
                  <Field
                    InputType={Input}
                    component={FormInputField}
                    prefix={<MailOutlined style={{ color: COLOR_BLACK_1 }} />}
                    name="email"
                    placeholder={EMAIL}
                    disabled={!isEdit}
                    hasFeedback
                  />
                </Form>
              </Formik>
            </Row>
            <Row style={{ textAlign: 'center' }}>
              {isEdit ? (
                <>
                  <Button type="primary" onClick={handleUnde} style={{ marginRight: '6px' }}>
                    {UNDO}
                  </Button>
                  <Button type="primary" onClick={() => hiddenInnerSubmitFormRef.current.click()}>
                    {SAVE}
                  </Button>
                </>
              ) : (
                <Button type="primary" onClick={() => setIsEdit(true)}>
                  {EDIT}
                </Button>
              )}
            </Row>
          </Card>
        </div>
      </Layout.Content>
    </PrivateLayout>
  );
};

export default ProfilePage;
