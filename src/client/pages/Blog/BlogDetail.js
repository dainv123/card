import React, { useState, useEffect } from 'react';
import { queries } from '../../graphql/graphql';
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import UserLayout from '../../components/Layouts/UserLayout';

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
    <UserLayout>
        <Layout.Content>
            <section id="blog" className="sub-page">
                {dataBlog && <div className="sub-page-inner">
                    <div className="section-title">
                        <div className="main-title">
                            <div className="title-main-page">
                                <h4>{dataBlog.name}</h4>
                                <p>{dataBlog.introduction}</p>
                            </div>
                        </div>
                    </div>
                    <div className="section-content">
                        <div className="row blog-grid-flex">
                            <div dangerouslySetInnerHTML={{ __html: dataBlog.content }} />
                        </div>
                    </div>
                </div>}
            </section>
        </Layout.Content>
    </UserLayout>
  );
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loggedIn: state.auth.loggedIn
  };
};

export default connect(mapStateToProps)(BlogDetailPage);
