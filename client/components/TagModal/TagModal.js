import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Form, Formik, Field } from 'formik';
import { Icon, Input, Button, Modal } from 'antd';
import { FormInputField } from '../FormInputField/FormInputField';
import { mutations } from '../../graphql/graphql';
import validators from '../../validators/validators';
import { COLOR_BLACK_1 } from '../../constants/common';
import { CANCEL, MAKE_YOUR_TAG, NAME, SUBMIT } from '../../constants/wording';

const TagModal = ({ data = {}, isModalOpen, handleOk, handleCancel }) => {
  const hiddenInnerSubmitFormRef = useRef(null);

  const [value, setValue] = useState({});

  const [isOpen, setIsOpen] = useState(false);

  const [CreateTag] = useMutation(mutations.CREATE_TAG);

  const [UpdateTag] = useMutation(mutations.UPDATE_TAG);

  const handleSubmitForm = async (values, actions) => {
    const { name } = values;

    const { setErrors, setSubmitting } = actions;

    if (value.id) {
      UpdateTag({ variables: { id: value.id, name } }).then(
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
          });
          setSubmitting(false);
          setErrors(errors);
        }
      );
    } else {
      CreateTag({ variables: { name } }).then(
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
          });
          setSubmitting(false);
          setErrors(errors);
        }
      );
    }
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
      title={MAKE_YOUR_TAG}
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
        initialValues={{ name: value.name || '' }}
        validationSchema={validators.tag.createTagSchema}
        onSubmit={(values, actions) => handleSubmitForm(values, actions)}
        enableReinitialize
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
            placeholder={NAME}
            hasFeedback
          />
        </Form>
      </Formik>
    </Modal>
  );
};

export default TagModal;
