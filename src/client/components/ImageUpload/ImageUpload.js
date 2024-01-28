import React, { useState } from 'react';
import { Button, Upload, Icon, message } from 'antd';

export const ImageUpload = ({
  field,
  form: { touched, errors, setFieldValue },
  maxCount = 1
}) => {
  const handleChange = info => {
    if (info.fileList.length > maxCount) {
      message.warning(`You can only upload up to ${maxCount} files.`);
      return false;
    }

    if (info.file.status === 'done') {
      console.log(info);
      setFieldValue(field.name, {
        name: info.fileList[0].name,
        data: info.fileList[0].thumbUrl,
        contentType: info.fileList[0].type,
      });
    }
    if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const customRequest = ({ file, onSuccess }) => {
    console.log(file);
    setTimeout(() => onSuccess(), 1000);
  };

  const uploadButton = (
    <div>
      Thumbnail: <Button icon="upload">Upload</Button>
    </div>
  );

  return (
    <Upload
      multiple={false}
      onChange={handleChange}
      customRequest={customRequest}
      listType="picture"
      items={field.value ? [field.value] : []}
    >
      {uploadButton}
    </Upload>
  );
};
