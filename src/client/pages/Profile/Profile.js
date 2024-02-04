import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import { Form, Formik, Field } from 'formik';
import { Layout, Icon, Input, Button, Row, Card, message } from 'antd';
import { mutations } from '../../graphql/graphql';
// import { SERVER_URI } from '../../constants/endpoint';
import PrivateLayout from '../../components/Layouts/PrivateLayout';
import validators from '../../validators/validators';
import { FormSelect } from '../../components/FormSelect/FormSelect';
import { FormInputField } from '../../components/FormInputField/FormInputField';
import { UPDATE_USER_SUCCESSFULLy } from '../../constants/wording';
import _s from './Profile.less';
import actions from '../../store/actions/actions';

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
        dispatch(
          setAuthUser({
            ...user,
            name,
            username,
            email
          })
        );
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
              <Icon style={{ paddingRight: '5px' }} type="user-add" /> Profile
            </p>
            <Row>
              <Formik
                ref={formmilkRef}
                validateOnBlur={false}
                initialValues={{
                  name: value.name || '',
                  username: value.username || '',
                  email: value.email || ''
                }}
                validationSchema={validators.user.updateSchema}
                onSubmit={(values, actions) => handleSubmitForm(values, actions)}
                enableReinitialize={true}
              >
                <Form>
                  <button type="submit" style={{ display: 'none' }} ref={hiddenInnerSubmitFormRef}>
                    Submit
                  </button>
                  <Field
                    InputType={Input}
                    component={FormInputField}
                    prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    name="name"
                    placeholder="Name"
                    disabled={!isEdit}
                    hasFeedback
                  />
                  <Field
                    InputType={Input}
                    component={FormInputField}
                    prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    name="username"
                    placeholder="User Name"
                    disabled={!isEdit}
                    hasFeedback
                  />
                  <Field
                    InputType={Input}
                    component={FormInputField}
                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    name="email"
                    placeholder="Email"
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
                    Undo
                  </Button>
                  <Button type="primary" onClick={() => hiddenInnerSubmitFormRef.current.click()}>
                    Save
                  </Button>
                </>
              ) : (
                <Button type="primary" onClick={() => setIsEdit(true)}>
                  Edit
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
