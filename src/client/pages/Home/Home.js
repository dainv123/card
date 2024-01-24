import React, { useRef, useState, useEffect } from 'react';
import { queries, mutations } from '../../graphql/graphql';
import { connect } from 'react-redux';
import { Icon, Avatar } from 'antd';
import { Route, Redirect } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import EditorModal from '../../components/EditorModal/EditorModal';

const HomePage = () => {
  return (
    <>
      <iframe
        src="../themes/daidev/index.html"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{
          overflow: 'hidden',
          overflowX: 'hidden',
          overflowY: 'hidden',
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px'
        }}
      />
    </>
  );
};

export default HomePage;
