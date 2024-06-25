import React, { useRef, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { queries, mutations } from '../../graphql/graphql';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Spin, Icon, Avatar, message } from 'antd';
import { Route, Redirect } from 'react-router-dom';
import EditorModal from '../../components/EditorModal/EditorModal';
import { SOMETHING_WENT_WRONG, UPDATE_CARD_SUCCESSFULLY } from '../../constants/wording';
import NotFound from '../../components/NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
// import {minify} from 'html-minifier'
// // var minify = require('html-minifier').minify;
// var result = minify('<p title="blah" id="moo">foo</p>', {
//   removeAttributeQuotes: true
// });

// console.log(result);

const ReaderPage = ({ loggedIn, user, ...rest }) => {
  const iframeRef = useRef(null);
  const [theme, setTheme] = useState('');
  const [config, setConfig] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataCard, setDataCard] = useState(null);
  const [dataTheme, setDataTheme] = useState(null);
  const [UpdateCard, { loading: updateCardLoading }] = useMutation(mutations.UPDATE_CARD);

  const responseCard = useQuery(!loggedIn ? queries.GET_PUBLIC_CARD : queries.GET_CARD, {
    variables: {
      // id: rest.match.params.id
      name: decodeURIComponent(rest.match.params.id || '')
    }
  });

  const responseTheme = useQuery(!loggedIn ? queries.GET_PUBLIC_THEME : queries.GET_THEME, {
    variables: {
      id: dataCard ? dataCard.themeId : null
    }
  });

  useEffect(() => {
    setDataCard(
      responseCard.data && (!loggedIn ? responseCard.data.publicCard : responseCard.data.card)
    );
  }, [responseCard.data]);

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

  const loading = useMemo(
    () => updateCardLoading || responseTheme.loading || responseCard.loading, [updateCardLoading, responseTheme.loading, responseCard.loading]);

  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };

  // const handleOk = config => {
  //   handleUpdateCard(config);
  //   setConfig(JSON.stringify(config) === '{}' ? configDefault : config);
  //   iframeRef.current.contentWindow.postMessage({
  //     type: 'internal-iframe-pass-inside',
  //     data: config
  //   });
  // };

  // const handleScrollToElement = element => {
  //   iframeRef.current.contentWindow.postMessage({
  //     type: 'scroll-to-element',
  //     data: element
  //   });
  // };

  const handleUpdateCard = config => {
    UpdateCard({ variables: { id: dataCard.id, config } }).then(
      res => message.success(UPDATE_CARD_SUCCESSFULLY),
      err => message.error(SOMETHING_WENT_WRONG)
    );
  };

  const handleCallback = event => {
    if (!iframeRef.current) {
      return;
    }

    if (event.data.type === 'internal-iframe-ready') {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'internal-iframe-pass-inside',
          data: dataCard.config,
          loggedIn
        });
      }
    }

    if (event.data.type === 'internal-iframe-back-outside') {
      handleUpdateCard(event.data.data);
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
      {loading && <Loading />}
      {
        theme 
        ? <iframe
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
        : (!loading && <NotFound />)
      }
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
