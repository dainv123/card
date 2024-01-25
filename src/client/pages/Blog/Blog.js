import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { NavLink } from 'react-router-dom';
import UserLayout from '../../components/Layouts/UserLayout';

const BlogPage = () => {
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
                <div className="col-md-4 col-sm-6 blog-item-quote blog-item">
                  <div className="blog-article">
                    <div className="post-format">
                      {' '}
                      <span className="post-format-icon">
                        <i className="fas fa-quote-right"></i>
                      </span>{' '}
                    </div>
                    <div className="comment-like">
                      {' '}
                      <span>
                        <i className="fas fa-comment" aria-hidden="true"></i> 30
                      </span>{' '}
                      <span>
                        <i className="fas fa-heart" aria-hidden="true"></i> 15
                      </span>{' '}
                    </div>
                    <div className="article-img">
                      <a href="blog-single.html">
                        <img
                          src="../../public/assets/images/blog/1.jpeg"
                          className="img-responsive"
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="article-content">
                      <div>
                        <h4>
                          <a href="blog-single.html">
                            Design is not just what it looks like .Design is how it works .
                          </a>
                        </h4>
                        <div className="meta">
                          {' '}
                          <span>
                            <i>Feb</i> 16,2016
                          </span>{' '}
                          <span>
                            <i>In</i> <a href="#">Shopping</a>
                          </span>{' '}
                          <span>
                            <i>Tags</i> <a href="#">Trends</a>
                          </span>{' '}
                        </div>
                        <div className="article-link">
                          {' '}
                          <a href="blog-single.html">
                            <i className="lnr lnr-arrow-right"></i>
                          </a>{' '}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8 col-sm-6 blog-item">
                  <div className="blog-article">
                    <div className="post-format">
                      {' '}
                      <span className="post-format-icon">
                        <i className="lnr lnr-picture"></i>
                      </span>{' '}
                    </div>
                    <div className="comment-like">
                      {' '}
                      <span>
                        <i className="fas fa-comment" aria-hidden="true"></i> 30
                      </span>{' '}
                      <span>
                        <i className="fas fa-heart" aria-hidden="true"></i> 15
                      </span>{' '}
                    </div>
                    <div className="article-img">
                      <a href="blog-single.html">
                        {' '}
                        <img
                          src="../../public/assets/images/blog/2.jpeg"
                          className="img-responsive"
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="article-link">
                      {' '}
                      <a href="blog-single.html">
                        <i className="lnr lnr-arrow-right"></i>
                      </a>{' '}
                    </div>
                    <div className="article-content">
                      <h4>
                        <a href="blog-single.html">The new clear bolg </a>
                      </h4>
                      <div className="meta">
                        {' '}
                        <span>
                          <i>Feb</i> 16,2016
                        </span>{' '}
                        <span>
                          <i>In</i> <a href="#">Shopping</a>
                        </span>{' '}
                        <span>
                          <i>Tags</i> <a href="#">Trends</a>
                        </span>{' '}
                      </div>
                      <p>
                        There are many variations of passages of Lorem Ipsum available, but the
                        majority .
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6 blog-item">
                  <div className="blog-article">
                    <div className="post-format">
                      {' '}
                      <span className="post-format-icon">
                        <i className="lnr lnr-film-play"></i>
                      </span>{' '}
                    </div>
                    <div className="comment-like">
                      {' '}
                      <span>
                        <i className="fas fa-comment" aria-hidden="true"></i> 30
                      </span>{' '}
                      <span>
                        <i className="fas fa-heart" aria-hidden="true"></i> 15
                      </span>{' '}
                    </div>
                    <div className="article-img">
                      <a href="blog-single.html">
                        {' '}
                        <img
                          src="../../public/assets/images/blog/3.jpeg"
                          className="img-responsive"
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="article-link">
                      {' '}
                      <a href="blog-single.html">
                        <i className="lnr lnr-arrow-right"></i>
                      </a>{' '}
                    </div>
                    <div className="article-content">
                      <h4>
                        <a href="blog-single.html">Content builder posts</a>
                      </h4>
                      <div className="meta">
                        {' '}
                        <span>
                          <i>Feb</i> 16,2016
                        </span>{' '}
                        <span>
                          <i>In</i> <a href="#">Shopping</a>
                        </span>{' '}
                        <span>
                          <i>Tags</i> <a href="#">Trends</a>
                        </span>{' '}
                      </div>
                      <p>
                        There are many variations of passages of Lorem Ipsum available, but the
                        majority .
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6 blog-item">
                  <div className="blog-article">
                    <div className="post-format">
                      {' '}
                      <span className="post-format-icon">
                        <i className="lnr lnr-picture"></i>
                      </span>{' '}
                    </div>
                    <div className="comment-like">
                      {' '}
                      <span>
                        <i className="fas fa-comment" aria-hidden="true"></i> 30
                      </span>{' '}
                      <span>
                        <i className="fas fa-heart" aria-hidden="true"></i> 15
                      </span>{' '}
                    </div>
                    <div className="article-img">
                      <a href="blog-single.html">
                        {' '}
                        <img
                          src="../../public/assets/images/blog/4.jpeg"
                          className="img-responsive"
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="article-link">
                      {' '}
                      <a href="blog-single.html">
                        <i className="lnr lnr-arrow-right"></i>
                      </a>{' '}
                    </div>
                    <div className="article-content">
                      <h4>
                        <a href="blog-single.html">Transitions In Design</a>
                      </h4>
                      <div className="meta">
                        {' '}
                        <span>
                          <i>Feb</i> 16,2016
                        </span>{' '}
                        <span>
                          <i>In</i> <a href="#">Shopping</a>
                        </span>{' '}
                        <span>
                          <i>Tags</i> <a href="#">Trends</a>
                        </span>{' '}
                      </div>
                      <p>
                        There are many variations of passages of Lorem Ipsum available, but the
                        majority .
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6 blog-item">
                  <div className="blog-article">
                    <div className="post-format">
                      {' '}
                      <span className="post-format-icon">
                        <i className="lnr lnr-picture"></i>
                      </span>{' '}
                    </div>
                    <div className="comment-like">
                      {' '}
                      <span>
                        <i className="fas fa-comment" aria-hidden="true"></i> 30
                      </span>{' '}
                      <span>
                        <i className="fas fa-heart" aria-hidden="true"></i> 15
                      </span>{' '}
                    </div>
                    <div className="article-img">
                      <a href="blog-single.html">
                        {' '}
                        <img
                          src="../../public/assets/images/blog/5.jpeg"
                          className="img-responsive"
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="article-link">
                      {' '}
                      <a href="blog-single.html">
                        <i className="lnr lnr-arrow-right"></i>
                      </a>{' '}
                    </div>
                    <div className="article-content">
                      <h4>
                        <a href="blog-single.html">Comfort classy outfits</a>
                      </h4>
                      <div className="meta">
                        {' '}
                        <span>
                          <i>Feb</i> 16,2016
                        </span>{' '}
                        <span>
                          <i>In</i> <a href="#">Shopping</a>
                        </span>{' '}
                        <span>
                          <i>Tags</i> <a href="#">Trends</a>
                        </span>{' '}
                      </div>
                      <p>
                        There are many variations of passages of Lorem Ipsum available, but the
                        majority .
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6 blog-item">
                  <div className="blog-article">
                    <div className="post-format">
                      {' '}
                      <span className="post-format-icon">
                        <i className="lnr lnr-film-play"></i>
                      </span>{' '}
                    </div>
                    <div className="comment-like">
                      {' '}
                      <span>
                        <i className="fas fa-comment" aria-hidden="true"></i> 30
                      </span>{' '}
                      <span>
                        <i className="fas fa-heart" aria-hidden="true"></i> 15
                      </span>{' '}
                    </div>
                    <div className="article-img">
                      <a href="blog-single.html">
                        {' '}
                        <img
                          src="../../public/assets/images/blog/6.jpeg"
                          className="img-responsive"
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="article-link">
                      {' '}
                      <a href="blog-single.html">
                        <i className="lnr lnr-arrow-right"></i>
                      </a>{' '}
                    </div>
                    <div className="article-content">
                      <h4>
                        <a href="blog-single.html">Recent trends in story</a>
                      </h4>
                      <div className="meta">
                        {' '}
                        <span>
                          <i>Feb</i> 16,2016
                        </span>{' '}
                        <span>
                          <i>In</i> <a href="#">Shopping</a>
                        </span>{' '}
                        <span>
                          <i>Tags</i> <a href="#">Trends</a>
                        </span>{' '}
                      </div>
                      <p>
                        There are many variations of passages of Lorem Ipsum available, but the
                        majority .
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6 blog-item">
                  <div className="blog-article">
                    <div className="post-format">
                      {' '}
                      <span className="post-format-icon">
                        <i className="lnr lnr-music-note"></i>
                      </span>
                    </div>
                    <div className="comment-like">
                      {' '}
                      <span>
                        <i className="fas fa-comment" aria-hidden="true"></i> 30
                      </span>{' '}
                      <span>
                        <i className="fas fa-heart" aria-hidden="true"></i> 15
                      </span>{' '}
                    </div>
                    <div className="article-img">
                      <a href="blog-single.html">
                        {' '}
                        <img
                          src="../../public/assets/images/blog/7.jpeg"
                          className="img-responsive"
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="article-link">
                      {' '}
                      <a href="blog-single.html">
                        <i className="lnr lnr-arrow-right"></i>
                      </a>{' '}
                    </div>
                    <div className="article-content">
                      <h4>
                        <a href="blog-single.html">Social media websites</a>
                      </h4>
                      <div className="meta">
                        {' '}
                        <span>
                          <i>Feb</i> 16,2016
                        </span>{' '}
                        <span>
                          <i>In</i> <a href="#">Shopping</a>
                        </span>{' '}
                        <span>
                          <i>Tags</i> <a href="#">Trends</a>
                        </span>{' '}
                      </div>
                      <p>
                        There are many variations of passages of Lorem Ipsum available, but the
                        majority .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout.Content>
    </UserLayout>
  );
};

export default BlogPage;
