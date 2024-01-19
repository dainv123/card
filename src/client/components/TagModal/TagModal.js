import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { Form, Formik, Field } from 'formik';
import { Icon, Input, Button, Checkbox, Card, Modal, Select } from 'antd';
import { FormSelect } from '../FormSelect/FormSelect';
import { FormInputField } from '../FormInputField/FormInputField';
import { mutations } from '../../graphql/graphql';
import validators from '../../validators/validators';

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
    if (isModalOpen != isOpen) {
      setIsOpen(isModalOpen);
    }
  }, [isModalOpen, data]);

  return (
    <Modal
      title="Make Your Tag"
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
        initialValues={{ name: data.name || '' }}
        validationSchema={validators.tag.createTagSchema}
        onSubmit={(values, actions) => handleSubmitForm(values, actions)}
        enableReinitialize
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
            hasFeedback
          />
        </Form>
      </Formik>
    </Modal>
  );
};

export default TagModal;
