import React from 'react';
import { Form, Input, Icon } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const QuillInput = ({ field, form: { touched, errors, setFieldValue }, hasFeedback, height, ...props }) => {
  const errorMessage = touched[field.name] && errors[field.name];
  let inputStatus;

  if (errorMessage) {
    inputStatus = 'error';
  } else if (touched[field.name] && field.value) {
    inputStatus = 'success';
  }

  return (
    <Form.Item help={errorMessage} validateStatus={inputStatus} hasFeedback={hasFeedback}>
      <ReactQuill
        {...field}
        {...props}
        style={height ? { height } : {}}
        onChange={(content, delta, source, editor) => {
          setFieldValue(field.name, editor.getHTML());
        }}
      />
    </Form.Item>
  );
};
