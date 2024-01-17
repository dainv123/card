import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Formik, Field } from 'formik';
import { Icon, Input, Button, Checkbox, Card, Modal, Select } from 'antd';
import { FormSelect } from '../FormSelect/FormSelect';
import { FormInputField } from '../FormInputField/FormInputField';
import { mutations } from '../../graphql/graphql';
import validators from '../../validators/validators';

const CardModal = ({ data = {}, themes = [], isModalOpen, handleOk, handleCancel }) => {
  const { Option } = Select;
  const { TextArea } = Input;

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

  const handleChange = themeId => {
    setValue({
      ...value,
      themeId,
      config: '{}'
    });
  };

  useEffect(() => {
    if (JSON.stringify(data) != JSON.stringify(value)) {
      setValue(data);
    }
    if (isModalOpen != isOpen) {
      setIsOpen(isModalOpen);
    }
  }, [isModalOpen, data]);

  return (
    <Modal
      title="Make Your Card"
      visible={isOpen}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => hiddenInnerSubmitFormRef.current.click()}
        >
          Submit
        </Button>
      ]}
    >
      <Formik
        validateOnBlur={false}
        initialValues={{
          name: value.name || '',
          userId: value.userId || '',
          themeId: value.themeId || '',
          config: value.config || '{}'
        }}
        validationSchema={validators.card.createCardSchema}
        onSubmit={(values, actions) => handleSubmitForm(values, actions)}
        enableReinitialize
      >
        <Form>
          <button type="submit" style={{ display: 'none' }} ref={hiddenInnerSubmitFormRef}>
            Submit
          </button>
          {/* <Field
            InputType={Input}
            component={FormInputField}
            prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
            name="name"
            onChange={handleChange} // todo
            placeholder="Name"
            hasFeedback
          /> */}
          <Field
            component={FormSelect}
            onChange={handleChange}
            name="themeId"
            placeholder="Select Theme"
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
            prefix={<Icon type="folder" style={{ color: 'rgba(0,0,0,.25)' }} />}
            name="config"
            placeholder="Config"
            hasFeedback
          />
        </Form>
      </Formik>
    </Modal>
  );
};

export default CardModal;
