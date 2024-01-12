import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { Form, Formik, Field } from 'formik';
import { Icon, Input, Button, Checkbox, Card, Modal, Select } from 'antd';
import { FormSelect } from '../FormSelect/FormSelect';
import { FormInputField } from '../FormInputField/FormInputField';
import { mutations } from '../../graphql/graphql';
import validators from '../../validators/validators';

const ThemeModal = ({ isModalOpen, handleOk, handleCancel }) => {
  const hiddenInnerSubmitFormRef = useRef(null);

  const [value, setValue] = useState({});

  const [isOpen, setIsOpen] = useState(false);

  const [CreateTheme] = useMutation(mutations.CREATE_THEME);

  const handleSubmitForm = async (values, actions) => {
    const { name, path } = values;
    const { setErrors, setSubmitting } = actions;
    CreateTheme({ variables: { name, path } }).then(
      res => {
        handleOk();
        setIsOpen(false);
      },
      err => {
        const errors = {};

        err.graphQLErrors.map(x => {
          if (x.message.includes('name')) {
            errors.name = x.message.includes('name');
          }
          if (x.message.includes('path')) {
            errors.path = x.message.includes('path');
          }
        });
        setSubmitting(false);
        setErrors(errors);
      }
    );
  };

  useEffect(() => setIsOpen(isModalOpen), [isModalOpen]);

  return (
    <Modal
      title="Create Theme"
      visible={isOpen}
      footer={[
        <Button key="back" onClick={handleCancel}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={() => hiddenInnerSubmitFormRef.current.click()}>Submit</Button>
      ]}
    >
      <Formik
        validateOnBlur={false}
        validationSchema={validators.theme.createThemeSchema}
        onSubmit={(values, actions) => handleSubmitForm(values, actions)}
      >
        <Form>
          <button type="submit" style={{ display: 'none' }} ref={hiddenInnerSubmitFormRef}>Submit</button>
          <Field
            InputType={Input}
            component={FormInputField}
            prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
            name="name"
            placeholder="Name"
            hasFeedback
          />
          <Field
            InputType={Input}
            component={FormInputField}
            prefix={<Icon type="folder" style={{ color: 'rgba(0,0,0,.25)' }} />}
            name="path"
            placeholder="Path"
            hasFeedback
          />
        </Form>
      </Formik>
    </Modal>
  );
};

export default ThemeModal;
