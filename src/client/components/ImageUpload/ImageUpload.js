import React, { useState, useMemo } from 'react';
import { Button, Upload, Icon, message } from 'antd';
import { SERVER_URI } from '../../constants/endpoint';

export const ImageUpload = ({
  field,
  form: { touched, errors, setFieldValue },
  singleUpload = true,
  maxCount = 1
}) => {
  const isImageURL = useMemo(() => typeof field.value === "string", [field]);

  const isExistedImage = useMemo(() => !!(singleUpload ? field.value : (field && field.length)), [field]);

  const uploadedImageCount = useMemo(() => isExistedImage ? (singleUpload ? 1 : field.value.length) : 0, [singleUpload, field]);

  const onDeleteOld = () => setFieldValue(field.name, null);

  const handleChange = info => {
    if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const customRequest = ({ file, onSuccess, onError }) => {
    if (uploadedImageCount >= maxCount) {
      message.error(`Maximum ${maxCount} images allowed.`);
      onError();
      return;
    }
    setFieldValue(field.name, file);
    setTimeout(() => onSuccess(), 800);
  };

  const previewImage = (url, onDelete) => (
    <div class="ant-upload-list ant-upload-list-picture">
      <div>
          <span>
              <div class="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture">
                  <div class="ant-upload-list-item-info">
                      <span>
                          <a class="ant-upload-list-item-thumbnail" target="_blank" rel="noopener noreferrer">
                              <img alt={url} class="ant-upload-list-item-image" src={SERVER_URI + url} />
                          </a>
                          <span class="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1"
                              title={url}>{url}</span>
                          <span class="ant-upload-list-item-card-actions picture">
                              <a title="Remove file" onClick={onDelete}>
                                  <i aria-label="icon: delete" title="Remove file" tabindex="-1"
                                      class="anticon anticon-delete">
                                      <svg viewBox="64 64 896 896" focusable="false" data-icon="delete" width="1em"
                                          height="1em" fill="currentColor" aria-hidden="true">
                                          <path
                                              d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z">
                                          </path>
                                      </svg>
                                  </i>
                              </a>
                          </span>
                      </span>
                  </div>
              </div>
          </span>
      </div>
    </div>
  )

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
      {/* FOR SINGLE FIRST */}
      {isImageURL && previewImage(field.value, onDeleteOld)}
    </>
  );
};
