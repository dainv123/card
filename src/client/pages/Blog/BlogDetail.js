import React, { useState, useEffect } from 'react';
import { queries } from '../../graphql/graphql';
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import UserLayout from '../../components/Layouts/UserLayout';
import { SERVER_URI } from '../../constants/endpoint';

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
              <div class="section-content">
                <div class="row pb-30">
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    {dataBlog.intro &&
                      <span class="about-location">
                        <i class="lnr lnr-map-marker"></i>
                        {dataBlog.intro}
                      </span>
                    }
                    <div dangerouslySetInnerHTML={{ __html: dataBlog.content }} />
                  </div>
                  <div class="col-xs-6 col-sm-12 col-md-6 col-lg-6">
                    <div class="box-img">
                      <img src={dataBlog.image ? SERVER_URI + dataBlog.image : '../public/assets/../../public/assets/images/about.png'} class="img-fluid" alt="image" />
                    </div>
                  </div>
                </div>
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
