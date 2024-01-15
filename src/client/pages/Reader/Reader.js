import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { Icon, Avatar } from 'antd';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { mutations, queries } from '../../graphql/graphql';

const ReaderPage = ({ loggedIn, user, ...rest }) => {
  const iframeRef = useRef(null);
  
  const responseCard = useQuery(queries.GET_CARD, {
    variables: {
      id: rest.match.params.id || '65a4b3af2f9c623184cac0a9'
    }
  });

  const dataCard = responseCard && responseCard.data && responseCard.data.card;

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.data == 'internal-iframe-ready' && iframeRef.current && dataCard) {
        iframeRef.current.contentWindow.postMessage(dataCard.config);
      }
    });
  }, [responseCard, dataCard]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {loggedIn && (
        <>
          <Avatar
            onClick={showModal}
            size="medium"
            icon="setting"
            style={{
              position: 'fixed',
              zIndex: 2,
              right: '30px',
              top: '30px'
            }}
          />
          {/* <SelectThemeModal
                            isModalOpen={isModalOpen}
                            handleOk={handleOk}
                            handleCancel={handleCancel}
                        ></SelectThemeModal> */}
        </>
      )}
      <iframe
        src="../themes/dahlia/index.html"
        width="100%"
        height="100%"
        frameBorder="0"
        ref={iframeRef}
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

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loggedIn: state.auth.loggedIn
  };
};

ReaderPage.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  user: PropTypes.object
};

const ConnectedReaderPage = connect(mapStateToProps)(ReaderPage);

export default ConnectedReaderPage;
