import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import { Form, Formik, Field } from 'formik';
import { Icon, Button, Modal, Upload } from 'antd';
import { mutations } from '../../graphql/graphql';
import { ImageUpload } from '../ImageUpload/ImageUpload';
import { uploadFile, deleteFile } from '../../utils/uploadFile';
import validators from '../../validators/validators';
import { COLOR_BLACK_1 } from '../../constants/common';
import { 
  ADD_YOUR_IMAGE,
  CANCEL, 
  IMAGE, 
  NAME, 
  PATH, 
  SUBMIT, 
  UPDATE_YOUR_IMAGE
} from '../../constants/wording';

const ImageModal = ({ data = {}, tags = [], isModalOpen, handleOk, handleCancel }) => {
  const hiddenInnerSubmitFormRef = useRef(null);
  const user = useSelector(state => state.auth.user);
  const [value, setValue] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [CreateImage] = useMutation(mutations.CREATE_IMAGE);
  const [UpdateImage] = useMutation(mutations.UPDATE_IMAGE);

  const handleSubmitForm = async (values, actions) => {
    const { image } = values;
    const { setErrors, setSubmitting } = actions;
    let imageURL = image;

    if (data.image !== image && image) {
      const imageResponse = await uploadFile(image);  // upload new image
      imageURL = imageResponse.file || '';
    }

    if (value.id) {
      UpdateImage({ variables: { id: value.id, userId: user.id, image: imageURL } }).then(
        res => {
          if (data.image !== image && data.image && image) {
            deleteFile(data.image); // clear legacy image
          }
          handleOk();
          setIsOpen(false);
        },
        err => {
          const errors = {};
          err.graphQLErrors.map(x => {
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
      CreateImage({ variables: {  userId: user.id, image: imageURL } }).then(
        res => {
          handleOk();
          setIsOpen(false);
        },
        err => {
          const errors = {};
          err.graphQLErrors.map(x => {
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
    }
  };

  useEffect(() => {
    if (data != value) {
      setValue(data);
    } else if (!isModalOpen) {
      setValue({});
    }
    
    if (isModalOpen != isOpen) {
      setIsOpen(isModalOpen);
    }
  }, [data, isModalOpen]);

  return (
    <Modal
      title={value.id ? UPDATE_YOUR_IMAGE : ADD_YOUR_IMAGE}
      visible={isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {CANCEL}
        </Button>,
        <Button key="submit" type="primary" onClick={() => hiddenInnerSubmitFormRef.current.click()}>
          {SUBMIT}
        </Button>
      ]}
    >
      <Formik
        validateOnBlur={false}
        initialValues={{ image: value.image || null }}
        validationSchema={validators.theme.createImageSchema}
        onSubmit={(values, actions) => handleSubmitForm(values, actions)}
        enableReinitialize
      >
        <Form>
          <button type="submit" style={{ display: 'none' }} ref={hiddenInnerSubmitFormRef}>
            {SUBMIT}
          </button>
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
        </Form>
      </Formik>
    </Modal>
  );
};

export default ImageModal;
