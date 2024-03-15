import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import { Link } from 'react-router-dom';
import { Form, Formik, Field } from 'formik';
import { useMutation } from '@apollo/react-hooks';
import { mutations } from '../../graphql/graphql';
import validators from '../../validators/validators';
import { QuillInput } from '../QuillInput/QuillInput';
import { ImageUpload } from '../ImageUpload/ImageUpload';
import { uploadFile, deleteFile } from '../../utils/uploadFile';
import { FormInputField } from '../FormInputField/FormInputField';
import { Icon, Input, Modal, Button, message } from 'antd';
import { COLOR_BLACK_1 } from '../../constants/common';
import {
  NAME,
  TREND,
  INTRODUCTION,
  IMAGE,
  CONTENT,
  CANCEL,
  SUBMIT, 
  UPDATE_YOUR_BLOG,
  ADD_YOUR_BLOG
} from '../../constants/wording';

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

    if (data.image !== image && image) {
      const imageResponse = await uploadFile(image);    // upload new image
      imageURL = imageResponse.file || '';
    }

    if (value.id) {
      UpdateBlog({
        variables: { id: value.id, name, trend, introduction, content, image: imageURL }
      }).then(
        res => {
          if (data.image !== image && data.image && image) {
            deleteFile(data.image); // clear legacy image
          }
          handleOk();
          setIsOpen(false);
        },
        err => {
          const errors = {};  // show error below fields
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
          if (data.image !== image && imageURL !== image) {
            deleteFile(imageURL); // clear uploaded image
          }
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
          // clear uploaded image
          if (data.image !== image && imageURL !== image) {
            deleteFile(imageURL);
          }
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
      title={value.id ? UPDATE_YOUR_BLOG : ADD_YOUR_BLOG}
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
        validationSchema={validators.blog.createBlogSchema}
        onSubmit={(values, actions) => handleSubmitForm(values, actions)}
        enableReinitialize
        initialValues={{
          name: value.name || '',
          trend: value.trend || '',
          image: value.image || null,
          content: value.content || '',
          introduction: value.introduction || '',
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
            placeholder={NAME}
            hasFeedback
          />
          <Field
            InputType={Input}
            component={FormInputField}
            prefix={<Icon type="folder" style={{ color: COLOR_BLACK_1 }} />}
            name="trend"
            placeholder={TREND}
            hasFeedback
          />
          <Field
            InputType={Input}
            component={FormInputField}
            prefix={<Icon type="folder" style={{ color: COLOR_BLACK_1 }} />}
            name="introduction"
            placeholder={INTRODUCTION}
            hasFeedback
          />
          <div className="ant-row ant-form-item">
            <Field
              showing={isOpen}
              component={ImageUpload}
              prefix={<Icon type="folder" style={{ color: COLOR_BLACK_1 }} />}
              name="image"
              placeholder={IMAGE}
              hasFeedback
            />
          </div>
          <Field
            InputType={ReactQuill}
            component={QuillInput}
            name="content"
            className="ant-input-affix-wrapper"
            placeholder={CONTENT}
            hasFeedback
          />
        </Form>
      </Formik>
    </Modal>
  );
};

export default BlogModal;
