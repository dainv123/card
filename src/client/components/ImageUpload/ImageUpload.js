import React, { useState, useMemo } from 'react';
import { Button, Upload, Icon, message } from 'antd';

export const ImageUpload = ({
  field,
  form: { touched, errors, setFieldValue },
  maxCount = 1
}) => {
  const disabled = useMemo(() => !!field.value, [field]);

  const handleChange = info => {
    if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const customRequest = ({ file, onSuccess }) => {
    setFieldValue(field.name, file);
    setTimeout(() => onSuccess(), 800);
  };

  return (
    <>
      <Upload
        accept="image/*"
        multiple={false}
        onChange={handleChange}
        customRequest={customRequest}
        listType="picture"
      >
        <div>
          Thumbnail: <Button icon="upload">Upload</Button>
        </div>
      </Upload>
    </>
  );
};
