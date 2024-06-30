import axios from 'axios';
import { UPLOAD_FILE_URI, DELETE_FILE_URI } from '../constants/endpoint';

export const uploadFile = async file => {
  const formData = new FormData();

  formData.append('file', file);

  return await axios
    .post(UPLOAD_FILE_URI, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log('Response:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

export const deleteFile = async filename => {
  return await axios
    .delete(DELETE_FILE_URI + filename)
    .then(response => {
      console.log('Response:', response.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
};
