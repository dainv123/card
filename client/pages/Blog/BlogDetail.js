import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { queries } from '../../graphql/graphql';
import PropTypes from 'prop-types';
import PublicLayout from '../../components/Layouts/PublicLayout';
import { SERVER_URI } from '../../constants/endpoint';
import { ABOUT_ME_IMAGE } from '../../constants/common';

const BlogDetailPage = ({ loggedIn, user, ...rest }) => {
  const [dataBlog, setDataBlog] = useState(null);

  const responseBlog = useQuery(!loggedIn ? queries.GET_PUBLIC_BLOG : queries.GET_BLOG, {
    variables: {
      name: decodeURIComponent(rest.match.params.id || '')
    }
  });

  useEffect(() => {
    setDataBlog(
      responseBlog.data && (!loggedIn ? responseBlog.data.publicBlog : responseBlog.data.blog)
    );
  }, [responseBlog.data]);

  return (
    <PublicLayout>
      <Layout.Content>
        <section id="blog" className="sub-page">
          {dataBlog && (
            <div className="sub-page-inner">
              <div className="section-title">
                <div className="main-title">
                  <div className="title-main-page">
                    <h4>{dataBlog.name}</h4>
                    <p>{dataBlog.introduction}</p>
                  </div>
                </div>
              </div>
              <div className="section-content">
                <div className="section-content">
                  <div className="row pb-30">
                    <div className="col-xs-12 col-sm-12 col-md-12">
                      {dataBlog.intro && (
                        <span className="about-location">
                          <i className="lnr lnr-map-marker"></i>
                          {dataBlog.intro}
                        </span>
                      )}
                      <div dangerouslySetInnerHTML={{ __html: dataBlog.content }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </Layout.Content>
    </PublicLayout>
  );
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loggedIn: state.auth.loggedIn
  };
};

export default connect(mapStateToProps)(BlogDetailPage);
