import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { Form, Formik, Field } from 'formik';
import { Icon, Input, Button, Checkbox, Card, Modal, Select, Upload } from 'antd';
import validators from '../../validators/validators';
import { FormSelect } from '../FormSelect/FormSelect';
import { ImageUpload } from '../ImageUpload/ImageUpload';
import { FormInputField } from '../FormInputField/FormInputField';
import { QuillInput } from '../QuillInput/QuillInput';
import { mutations } from '../../graphql/graphql';
import { uploadFile, deleteFile } from '../../utils/uploadFile';

const { TextArea } = Input;

const BlogModal = ({ data = {}, isModalOpen, handleOk, handleCancel }) => {
  const hiddenInnerSubmitFormRef = useRef(null);
  const [value, setValue] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [CreateBlog] = useMutation(mutations.CREATE_BLOG);
  const [UpdateBlog] = useMutation(mutations.UPDATE_BLOG);

  const handleSubmitForm = async (values, actions) => {
    const { name, trend, introduction, content, image } = values;

    const { setErrors, setSubmitting } = actions;

    let imageURL = image;

    if (data.image !== image) {
      imageURL = await uploadFile(image);

      if (data.image && image) {
        deleteFile(data.image);
      }
    }

    if (value.id) {
      UpdateBlog({
        variables: { id: value.id, name, trend, introduction, content, image: imageURL }
      }).then(
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
            if (x.message.includes('trend')) {
              errors.trend = x.message.includes('trend');
            }
            if (x.message.includes('introduction')) {
              errors.introduction = x.message.includes('introduction');
            }
            if (x.message.includes('content')) {
              errors.content = x.message.includes('content');
            }
            if (x.message.includes('image')) {
              errors.image = x.message.includes('image');
            }
          });
          setSubmitting(false);
          setErrors(errors);
        }
      );
    } else {
      CreateBlog({ variables: { name, trend, introduction, content, image: imageURL } }).then(
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
            if (x.message.includes('trend')) {
              errors.trend = x.message.includes('trend');
            }
            if (x.message.includes('introduction')) {
              errors.introduction = x.message.includes('introduction');
            }
            if (x.message.includes('content')) {
              errors.content = x.message.includes('content');
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
      title="Make Your Blog"
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
          trend: value.trend || '',
          introduction: value.introduction || '',
          content: value.content || '',
          image: value.image || null
        }}
        validationSchema={validators.tag.createBlogSchema}
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
            name="trend"
            placeholder="Trend"
            hasFeedback
          />
          <Field
            InputType={Input}
            component={FormInputField}
            prefix={<Icon type="folder" style={{ color: 'rgba(0,0,0,.25)' }} />}
            name="introduction"
            placeholder="Introduction"
            hasFeedback
          />
          <div className="ant-row ant-form-item">
            <Field
              InputType={Input}
              component={ImageUpload}
              prefix={<Icon type="folder" style={{ color: 'rgba(0,0,0,.25)' }} />}
              name="image"
              placeholder="Image"
              hasFeedback
            />
          </div>
          <Field
            InputType={ReactQuill}
            component={QuillInput}
            name="content"
            placeholder="Content"
            hasFeedback
          />
        </Form>
      </Formik>
    </Modal>
  );
};

export default BlogModal;
