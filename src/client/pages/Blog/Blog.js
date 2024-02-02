import React, { useEffect } from 'react';
import { Layout } from 'antd';
import UserLayout from '../../components/Layouts/UserLayout';
import { useQuery } from '@apollo/react-hooks';
import { queries } from '../../graphql/graphql';
import { SERVER_URI, BLOG_URI } from '../../constants/endpoint';


const BlogPage = () => {
  const responseBlog = useQuery(queries.GET_BLOGS);

  const dataBlog = (responseBlog && responseBlog.data && responseBlog.data.blogs) || [];

  const formatDate = (timestamp) => {
    const date = new Date(1 * timestamp);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  }

  return (
    <UserLayout>
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
              {dataBlog && dataBlog.map((blog, index) => {
                const className = index == 0 
                  ? 'col-md-4 col-sm-6 blog-item-quote blog-item' 
                    : (index == 1 ? "col-md-8 col-sm-6 blog-item" : "col-md-4 col-sm-6 blog-item");

                return <>
                  <div className={className}>
                    <div className="blog-article">
                      {!index && 
                        <div className="post-format">
                        {' '}
                        <span className="post-format-icon">
                          <i className="fas fa-quote-right"></i>
                        </span>
                      </div>}
                      <div className="article-img">
                        <a href="blog-single.html">
                          <img
                            src={SERVER_URI + blog.image}
                            className="img-responsive"
                            alt=""
                          />
                        </a>
                      </div>
                      <div className="article-link">
                        <a href={BLOG_URI + blog.id}>
                          <i className="lnr lnr-arrow-right"></i>
                        </a>
                      </div>
                      <div className="article-content">
                        <h4>
                          <a href={BLOG_URI + blog.name}>{blog.name}</a>
                        </h4>
                        <div className="meta">
                          <span>
                            {formatDate(blog.updatedAt)}
                          </span>{' '}
                          <span>
                            {blog.trend}
                          </span>
                        </div>
                        {!!index && <p>{blog.introduction}</p>}
                      </div>
                    </div>
                  </div>
                </>
              })}
              </div>
            </div>
          </div>
        </section>
      </Layout.Content>
    </UserLayout>
  );
};

export default BlogPage;
