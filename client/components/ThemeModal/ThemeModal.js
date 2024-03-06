import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Form, Formik, Field } from 'formik';
import { Icon, Input, Button, Modal, Upload, Select } from 'antd';
import { FormSelect } from '../FormSelect/FormSelect';
import { ImageUpload } from '../ImageUpload/ImageUpload';
import { FormInputField } from '../FormInputField/FormInputField';
import { mutations } from '../../graphql/graphql';
import { uploadFile, deleteFile } from '../../utils/uploadFile';
import validators from '../../validators/validators';
import { COLOR_BLACK_1 } from '../../constants/common';
import { 
  CANCEL, 
  IMAGE, 
  MAKE_YOUR_THEME, 
  NAME, 
  PATH, 
  SELECT_TAGS, 
  SUBMIT 
} from '../../constants/wording';

const ThemeModal = ({ data = {}, tags = [], isModalOpen, handleOk, handleCancel }) => {
  const hiddenInnerSubmitFormRef = useRef(null);
  const [value, setValue] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [CreateTheme] = useMutation(mutations.CREATE_THEME);
  const [UpdateTheme] = useMutation(mutations.UPDATE_THEME);

  const handleSubmitForm = async (values, actions) => {
    const { name, path, tags, image } = values;

    const { setErrors, setSubmitting } = actions;

    let imageURL = image;

    if (data.image !== image && image) {
      const imageResponse = await uploadFile(image);
      imageURL = imageResponse.file || '';
    }

    if (value.id) {
      UpdateTheme({ variables: { id: value.id, name, path, tags, image: imageURL } }).then(
        res => {
          if (data.image !== image && data.image && image) {
            // clear legacy image
            deleteFile(data.image);
          }
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
            if (x.message.includes('image')) {
              errors.image = x.message.includes('image');
            }
          });
          
          // clear uploaded image
          if (data.image !== image && imageURL !== image) {
            deleteFile(imageURL);
          }

          setSubmitting(false);
          setErrors(errors);
        }
      );
    } else {
      CreateTheme({ variables: { name, path, tags, image: imageURL } }).then(
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
            if (x.message.includes('image')) {
              errors.image = x.message.includes('image');
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
      title={MAKE_YOUR_THEME}
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
        initialValues={{
          name: value.name || '',
          path: value.path || '',
          tags: (value.tags || []).map(i => i.id),
          image: value.image || null
        }}
        validationSchema={validators.theme.createThemeSchema}
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
          <Field
            InputType={Input}
            component={FormInputField}
            prefix={<Icon type="folder" style={{ color: COLOR_BLACK_1 }} />}
            name="path"
            placeholder={PATH}
            hasFeedback
          />
          <div className="ant-row ant-form-item">
            <Field
              component={ImageUpload}
              prefix={<Icon type="folder" style={{ color: COLOR_BLACK_1 }} />}
              name="image"
              placeholder={IMAGE}
              showing={isOpen}
              hasFeedback
            />
          </div>
          <Field
            component={FormSelect}
            name="tags"
            mode="multiple"
            placeholder={SELECT_TAGS}
            style={{ width: '100%' }}
          >
            {tags.map(tag => (
              <Select.Option key={tag.id} value={tag.id}>
                {tag.name}
              </Select.Option>
            ))}
          </Field>
        </Form>
      </Formik>
    </Modal>
  );
};

export default ThemeModal;
