import React, { useEffect } from 'react';
import { Layout } from 'antd';
import PublicLayout from '../../components/Layouts/PublicLayout';
import { useQuery } from '@apollo/react-hooks';
import { queries } from '../../graphql/graphql';
import { SERVER_URI, BLOG_URI } from '../../constants/endpoint';
import { useSelector } from 'react-redux';

const BlogPage = () => {
  const loggedIn = useSelector(state => state.auth.loggedIn);

  const responseBlog = useQuery(loggedIn ? queries.GET_BLOGS : queries.GET_PUBLIC_BLOGS);

  const dataBlog =
    (responseBlog &&
      responseBlog.data &&
      (responseBlog.data.blogs || responseBlog.data.publicBlogs)) ||
    [];

  const formatDate = timestamp => {
    const date = new Date(1 * timestamp);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <PublicLayout>
      <Layout.Content>
        <section id="blog" className="sub-page">
          <div className="sub-page-inner">
            <div className="section-title">
              <div className="main-title">
                <div className="title-main-page">
                  <h4>Blog</h4>
                  <p>I share my news and blog</p>
                </div>
              </div>
            </div>

            <div className="section-content">
              <div className="row blog-grid-flex">
                {dataBlog &&
                  dataBlog.map((blog, index) => {
                    const className =
                      index == 0
                        ? 'col-md-4 col-sm-6 blog-item-quote blog-item'
                        : index == 1
                          ? 'col-md-8 col-sm-6 blog-item'
                          : 'col-md-4 col-sm-6 blog-item';

                    return (
                      <>
                        <div className={className} key={blog.id}>
                          <div className="blog-article">
                            {!index && (
                              <div className="post-format">
                                {' '}
                                <span className="post-format-icon">
                                  <i className="fas fa-quote-right"></i>
                                </span>
                              </div>
                            )}
                            <div className="article-img">
                              <a href={BLOG_URI + blog.name}>
                                <img
                                  src={SERVER_URI + blog.image}
                                  className="img-responsive"
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="article-link">
                              <a href={BLOG_URI + blog.name}>
                                <i className="lnr lnr-arrow-right"></i>
                              </a>
                            </div>
                            <div className="article-content">
                              <h4>
                                <a href={BLOG_URI + blog.name}>{blog.name}</a>
                              </h4>
                              <div className="meta">
                                <span>{formatDate(blog.updatedAt)}</span> <span>{blog.trend}</span>
                              </div>
                              {!!index && <p>{blog.introduction}</p>}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>
      </Layout.Content>
    </PublicLayout>
  );
};

export default BlogPage;
