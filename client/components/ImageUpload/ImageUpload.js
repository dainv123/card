import React, { useState, useMemo, useEffect } from 'react';
import { Button, Upload, Icon, message } from 'antd';
import { GET_FILE_URI, SERVER_URI } from '../../constants/endpoint';
import { 
  FILE_UPLOAD_FAILED, 
  IMAGE, 
  MAXIMUM_UPLOAD_MESSAGE, 
  UPLOAD 
} from '../../constants/wording';

export const ImageUpload = ({
  field,
  form: { touched, errors, setFieldValue },
  singleUpload = true,
  showing = true,
  maxCount = 1,
  ...props
}) => {
  const [fileList, setFileList] = useState([]);

  const isImageURL = useMemo(
    () => typeof field.value === 'string', [field]);

  const isExistedImage = useMemo(
    () => !!(singleUpload ? field.value : field && field.length), [field]);

  const uploadedImageCount = useMemo(
    () => (isExistedImage ? (singleUpload ? 1 : field.value.length) : 0), [singleUpload, field]);

  const resetFileList = () => setFileList([]);

  const onDeleteOld = () => setFieldValue(field.name, null);

  const onChange = ({ file, fileList: newFileList }) => {
    if (file.status === 'error') {
      message.error(FILE_UPLOAD_FAILED(file.name));
      return;
    }

    if (
      file.status === 'removed' && 
      !newFileList.filter(item => item.status == "done").length && 
      !isImageURL
    ) {
      setFieldValue(field.name, "");
    }

    setFileList(newFileList);
  };

  const beforeUpload = () => {
    if (uploadedImageCount >= maxCount) {
      message.error(MAXIMUM_UPLOAD_MESSAGE(maxCount));
      return;
    }
  };

  const customRequest = ({ file, onSuccess, onError }) => {
    if (uploadedImageCount >= maxCount) {
      setTimeout(() => onError(), 0);
      return;
    }

    setTimeout(() => {
      onSuccess();
      setFieldValue(field.name, file);
    }, 800);
  };

  useEffect(() => {
    if (!showing) {
      resetFileList();
    }
  }, [showing]);

  const previewImage = (url, onDelete) => (
    <div className="ant-upload-list ant-upload-list-picture">
      <div>
        <span>
          <div className="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture">
            <div className="ant-upload-list-item-info">
              <span>
                <a
                  className="ant-upload-list-item-thumbnail"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img alt={url} className="ant-upload-list-item-image" src={GET_FILE_URI + url} />
                </a>
                <span
                  className="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1"
                  title={url}
                >
                  {url}
                </span>
                <span className="ant-upload-list-item-card-actions picture">
                  <a title="Remove file" onClick={onDelete}>
                    <i
                      aria-label="icon: delete"
                      title="Remove file"
                      tabIndex="-1"
                      className="anticon anticon-delete"
                    >
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="delete"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
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
  );

  return (
    <>
      <Upload
        accept="image/*"
        listType="picture"
        multiple={false}
        fileList={fileList}
        onChange={onChange}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        {...props}
      >
        <div>
          {IMAGE}: <Button icon="upload">{UPLOAD}</Button>
        </div>
      </Upload>
      {/* FOR SINGLE FIRST */}
      {isImageURL && field.value && previewImage(field.value, onDeleteOld)}
    </>
  );
};
