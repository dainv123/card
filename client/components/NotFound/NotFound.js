import React from 'react';
import { PAGE_NOT_FOUND } from '../../constants/wording';
import './style.css'; 

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h3>{PAGE_NOT_FOUND}</h3>
    </div>
  );
};

export default NotFound;