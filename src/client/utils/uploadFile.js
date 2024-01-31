import axios from 'axios';
import { UPLOAD_URI, UPLOAD_DELETE_URI } from '../config/constants';

export const uploadFile = async file => {
  const formData = new FormData();

  formData.append('file', file);

  return await axios
    .post(UPLOAD_URI, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log('Response:', response.data);
      return response.data.url;
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

export const deleteFile = async filename => {
  return await axios
    .post(UPLOAD_DELETE_URI, {
      filename: filename
    })
    .then(response => {
      console.log('Response:', response.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
};
