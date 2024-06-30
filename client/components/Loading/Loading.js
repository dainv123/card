import React from 'react';
import { Spin } from 'antd';
import './style.css'; 

const Loading = () => {
  return (
    <div className="loading-container">
      <Spin size="large" tip="Loading..." />
    </div>
  );
};

export default Loading;