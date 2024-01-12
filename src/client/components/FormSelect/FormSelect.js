import React from 'react';
import { Form, Select } from 'antd';

export const FormSelect = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  InputType,
  hasFeedback,
  hideErrorMessage,
  ...props
}) => {
  const errorMessage = hideErrorMessage ? false : touched[field.name] && errors[field.name];
  let inputStatus;

  if (errorMessage) {
    inputStatus = 'error';
  } else if (touched[field.name] && field.value) {
    inputStatus = 'success';
  }

  return (
    <Form.Item help={errorMessage} validateStatus={inputStatus} hasFeedback={hasFeedback}>
      <Select {...field} {...props}>
        {props.children}
      </Select>
    </Form.Item>
  );
};
