import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { Form, Formik, Field } from 'formik';
import { Icon, Input, Button, Checkbox, Card, Modal, Select, Upload } from 'antd';
import { FormSelect } from '../FormSelect/FormSelect';
import { ImageUpload } from '../ImageUpload/ImageUpload';
import { FormInputField } from '../FormInputField/FormInputField';
import { mutations } from '../../graphql/graphql';
import validators from '../../validators/validators';

const ThemeModal = ({ data = {}, tags = [], isModalOpen, handleOk, handleCancel }) => {
  const hiddenInnerSubmitFormRef = useRef(null);
  const [value, setValue] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [CreateTheme] = useMutation(mutations.CREATE_THEME);
  const [UpdateTheme] = useMutation(mutations.UPDATE_THEME);

  const handleSubmitForm = async (values, actions) => {
    const { name, path, tags, image } = values;

    const { setErrors, setSubmitting } = actions;

    if (value.id) {
      UpdateTheme({ variables: { id: value.id, name, path, tags, image } }).then(
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
            if (x.message.includes('tags')) {
              errors.tags = x.message.includes('tags');
            }
          });
          setSubmitting(false);
          setErrors(errors);
        }
      );
    } else {
      CreateTheme({ variables: { name, path, tags, image } }).then(
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
            if (x.message.includes('tags')) {
              errors.tags = x.message.includes('tags');
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
  };

  return (
    <Modal
      title="Make Your Theme"
      visible={isOpen}
      onCancel={handleCancel}
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
          path: value.path || '',
          tags: (value.tags || []).map(i => i.id),
          image: value.image || null
        }}
        validationSchema={validators.tag.createThemeSchema}
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
          <Field
            InputType={Input}
            component={FormInputField}
            prefix={<Icon type="folder" style={{ color: 'rgba(0,0,0,.25)' }} />}
            name="path"
            placeholder="Path"
            hasFeedback
          />
          <input type="file" onChange={handleFileChange} />
          <Field
            component={ImageUpload}
            prefix={<Icon type="folder" style={{ color: 'rgba(0,0,0,.25)' }} />}
            name="image"
            placeholder="Image"
            hasFeedback
          />
          <Field
            component={FormSelect}
            name="tags"
            mode="multiple"
            placeholder="Select Tags"
            style={{ width: '100%' }}
          >
            {tags.map(tag => (
              <Select.Option key={tag.id} value={tag.id}>{tag.name}</Select.Option>
            ))}
          </Field>
        </Form>
      </Formik>
    </Modal>
  );
};

export default ThemeModal;
