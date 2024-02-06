import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { queries, mutations } from '../../graphql/graphql';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Icon, Avatar, message } from 'antd';
import { Route, Redirect } from 'react-router-dom';
import EditorModal from '../../components/EditorModal/EditorModal';
import { PAGE_NOT_FOUND, SOMETHING_WENT_WRONG } from '../../constants/wording';

const ReaderPage = ({ loggedIn, user, ...rest }) => {
  const iframeRef = useRef(null);
  const [theme, setTheme] = useState('');
  const [config, setConfig] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataCard, setDataCard] = useState(null);
  const [dataTheme, setDataTheme] = useState(null);
  const [UpdateCard] = useMutation(mutations.UPDATE_CARD);

  const responseCard = useQuery(!loggedIn ? queries.GET_PUBLIC_CARD : queries.GET_CARD, {
    variables: {
      // id: rest.match.params.id
      name: decodeURIComponent(rest.match.params.id || '')
    }
  });

  useEffect(() => {
    setDataCard(
      responseCard.data && (!loggedIn ? responseCard.data.publicCard : responseCard.data.card)
    );
  }, [responseCard.data]);

  const responseTheme = useQuery(!loggedIn ? queries.GET_PUBLIC_THEME : queries.GET_THEME, {
    variables: {
      id: dataCard ? dataCard.themeId : null
    }
  });

  useEffect(() => {
    setDataTheme(
      responseTheme.data && (!loggedIn ? responseTheme.data.publicTheme : responseTheme.data.theme)
    );
  }, [responseTheme.data]);

  useEffect(() => {
    if (dataTheme) {
      setTheme(`..${dataTheme.path.trim()}/index.html`);
    }
  }, [dataTheme]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = config => {
    handleUpdateCard(config);

    // if (JSON.stringify(config) !== '{}') {
    //   setConfig(config);
    // }

    iframeRef.current.contentWindow.postMessage({
      type: 'internal-iframe-pass-inside',
      data: config
    });
  };

  const handleUpdateCard = config => {
    UpdateCard({ variables: { id: dataCard.id, config: JSON.stringify(config) } }).then(
      res => setIsModalOpen(false),
      err => message.error(SOMETHING_WENT_WRONG)
    );
  };

  const handleCallback = event => {
    if (event.data.type === 'internal-iframe-ready' && iframeRef.current) {
      if (dataCard && dataCard.config && dataCard.config !== '{}') {
        setConfig(JSON.parse(dataCard.config));
        iframeRef.current.contentWindow.postMessage({
          type: 'internal-iframe-pass-inside',
          data: dataCard.config
        });
      } else {
        setConfig(event.data.data);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleCallback);

    return () => {
      window.removeEventListener('message', handleCallback);
    };
  }, [dataCard]);

  return (
    <>
      {loggedIn && theme && (
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
          <EditorModal
            data={config}
            isModalOpen={isModalOpen}
            handleOk={handleOk}
            handleCancel={handleCancel}
          />
        </>
      )}
      {theme ? (
        <iframe
          src={theme}
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
      ) : (
        PAGE_NOT_FOUND
      )}
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loggedIn: state.auth.loggedIn
  };
};

export default connect(mapStateToProps)(ReaderPage);
