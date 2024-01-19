import React from 'react';
import { Form, Select } from 'antd';

export const FormSelect = ({
  field,
  form: { touched, errors, setFieldValue },
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

  const handleChange = (selectedValues) => {
    setFieldValue(field.name, selectedValues);
  };

  return (
    <Form.Item help={errorMessage} validateStatus={inputStatus} hasFeedback={hasFeedback}>
      <Select
        {...field}
        {...props}
        onChange={handleChange}
        value={field.value}
      >
        {props.children}
      </Select>
    </Form.Item>
  );
};