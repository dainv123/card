import React, { useState } from 'react';
import { Button, Upload, Icon, message } from 'antd';

export const ImageUpload = ({ value, onChange, maxCount = 1 }) => {
  const handleChange = info => {
    if (info.fileList.length > maxCount) {
      message.warning(`You can only upload up to ${maxCount} files.`);
      return false;
    }

    if (info.file.status === 'done') {
      onChange(info.file.response);
    }
    if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const customRequest = ({ file, onSuccess }) => setTimeout(() => onSuccess(), 0);

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
      items={value ? [value] : []}
    >
      {uploadButton}
    </Upload>
  );
};
