import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Formik, Field } from 'formik';
import { FormSelect } from '../FormSelect/FormSelect';
import { FormInputField } from '../FormInputField/FormInputField';
import { mutations } from '../../graphql/graphql';
import validators from '../../validators/validators';
import { Icon, Input, Button, Modal, Select } from 'antd';
import { COLOR_BLACK_1 } from '../../constants/common';
import {
  NAME,
  CONFIG,
  CANCEL,
  SUBMIT,
  SELECT_THEME,
  UPDATE_YOUR_CARD,
  ADD_YOUR_CARD
} from '../../constants/wording';

const { Option } = Select;

const { TextArea } = Input;

const CardModal = ({ data = {}, themes = [], isModalOpen, handleOk, handleCancel }) => {
  const user = useSelector(state => state.auth.user);

  const hiddenInnerSubmitFormRef = useRef(null);

  const [value, setValue] = useState({});

  const [isOpen, setIsOpen] = useState(false);

  const [CreateCard] = useMutation(mutations.CREATE_CARD);

  const [UpdateCard] = useMutation(mutations.UPDATE_CARD);

  const handleSubmitForm = async (values, actions) => {
    const { name, themeId, config } = values;

    const { setErrors, setSubmitting } = actions;

    if (value.id) {
      UpdateCard({ variables: { id: value.id, userId: value.userId, themeId, name, config } }).then(
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
            if (x.message.includes('themeId')) {
              errors.themeId = x.message.includes('themeId');
            }
            if (x.message.includes('config')) {
              errors.config = x.message.includes('config');
            }
          });
          setSubmitting(false);
          setErrors(errors);
        }
      );
    } else {
      CreateCard({ variables: { userId: user.id, themeId, name, config } }).then(
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
            if (x.message.includes('themeId')) {
              errors.themeId = x.message.includes('themeId');
            }
            if (x.message.includes('config')) {
              errors.config = x.message.includes('config');
            }
          });
          setSubmitting(false);
          setErrors(errors);
        }
      );
    }
  };

  const handleNameChange = event => {
    setValue({
      ...value, name: event.target.value
    });
  };

  const handleThemeChange = themeId => {
    setValue({
      ...value, themeId, config: ''
    });
  };

  useEffect(() => {
    if (JSON.stringify(data) != JSON.stringify(value)) {
      setValue(data);
    }
  }, [data]);

  useEffect(() => {
    if (!isModalOpen) {
      setValue({});
    }
    if (isModalOpen != isOpen) {
      setIsOpen(isModalOpen);
    }
  }, [isModalOpen]);

  return (
    <Modal
      title={value.id ? UPDATE_YOUR_CARD : ADD_YOUR_CARD}
      visible={isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {CANCEL}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => hiddenInnerSubmitFormRef.current.click()}
        >
          {SUBMIT}
        </Button>
      ]}
    >
      <Formik
        validateOnBlur={false}
        validationSchema={validators.card.createCardSchema}
        onSubmit={(values, actions) => handleSubmitForm(values, actions)}
        enableReinitialize
        initialValues={{
          name: value.name || '',
          userId: value.userId || '',
          config: value.config || '',
          themeId: value.themeId || (themes.length && themes[0].id) || ''
        }}
      >
        <Form>
          <button type="submit" style={{ display: 'none' }} ref={hiddenInnerSubmitFormRef}>
            {SUBMIT}
          </button>
          <Field
            InputType={Input}
            component={FormInputField}
            prefix={<Icon type="idcard" style={{ color: COLOR_BLACK_1 }} />}
            name="name"
            onChange={handleNameChange}
            placeholder={NAME}
            hasFeedback
          />
          <Field
            component={FormSelect}
            onChange={handleThemeChange}
            name="themeId"
            placeholder={SELECT_THEME}
            style={{ width: '100%' }}
          >
            {themes.map(theme => (
              <Option key={theme.id} value={theme.id}>
                {theme.name} - {theme.path}
              </Option>
            ))}
          </Field>
          <Field
            InputType={TextArea}
            component={FormInputField}
            prefix={<Icon type="folder" style={{ color: COLOR_BLACK_1 }} />}
            name="config"
            placeholder={CONFIG}
            hasFeedback
          />
        </Form>
      </Formik>
    </Modal>
  );
};

export default CardModal;
