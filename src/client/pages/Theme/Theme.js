import React, { useEffect, useMemo } from 'react';
import { Layout } from 'antd';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import UserLayout from '../../components/Layouts/UserLayout';
import { queries } from '../../graphql/graphql';
import { SERVER_URI } from '../../config/constants';

const ThemePage = () => {
  const responseTheme = useQuery(queries.GET_THEMES);

  const dataTheme = (responseTheme && responseTheme.data && responseTheme.data.themes) || [];

  const responseTag = useQuery(queries.GET_TAGS);

  const dataTag = (responseTag && responseTag.data && responseTag.data.tags) || [];

  const counter = (dataTheme, tagId) => {
    return dataTheme.filter(theme => theme.tags.some(tag => tag.id == tagId)).length;
  }

  const formatCount = (count) => count > 9 ? count : ('0' + count);

  return (
    <UserLayout>
      <Layout.Content>
        <section id="portfolio" className="sub-page">
          <div className="sub-page-inner">
            <div className="section-title">
              <div className="main-title">
                <div className="title-main-page">
                  <h4>Theme</h4>
                  <p>Feel free to take a brief look and utilize them as needed.</p>
                </div>
              </div>
            </div>

            <div className="section-content">
              <div className="filter-tabs">
                <button className="fil-cat" data-rel="all">
                  All
                </button>
                {dataTag && dataTag.map(tag => {
                  const count = counter(dataTheme, tag.id);
                  return (
                    !!count && <button className="fil-cat">
                      <span>{formatCount(count)}</span> {tag.name}
                    </button>
                  )
                })}
              </div>

              <div className="portfolio-grid portfolio-trigger" id="portfolio-page">
                <div className="label-portfolio">
                  <span className="rotated-sub">project</span>
                  <span className="project-count">9</span>
                </div>
                <div className="row">
                  {dataTheme && dataTheme.map(theme => <>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 portfolio-item website all">
                      <div className="portfolio-img">
                        <img
                          src={SERVER_URI + theme.image}
                          className="img-responsive"
                          alt=""
                        />
                      </div>
                      <div className="portfolio-data">
                        <h4>
                          <a href={theme.path}>{theme.name}</a>
                        </h4>
                        <div className="portfolio-attr">
                          <a href={theme.path}>
                            <i className="lnr lnr-link"></i>
                          </a>
                          <a
                            href={SERVER_URI + theme.image}
                            data-rel="lightcase:gal"
                            title={theme.name}
                          >
                            <i className="lnr lnr-move"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </>)}
                  {/* <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 portfolio-item website mobile all">
                    <div className="portfolio-img">
                      <img
                        src="../../public/assets/images/portfolio/portfolio-img-2.jpeg"
                        className="img-responsive"
                        alt=""
                      />
                    </div>
                    <div className="portfolio-data">
                      <h4>
                        <a href="https://adstudio.blueseed.tv/">Ad Studio</a>
                      </h4>
                      <p className="meta">Laravel, JQuery</p>
                      <div className="portfolio-attr">
                        <a href="https://adstudio.blueseed.tv/">
                          <i className="lnr lnr-link"></i>
                        </a>
                        <a
                          href="images/portfolio/portfolio-img-2.jpeg"
                          data-rel="lightcase:gal"
                          title="Image Caption"
                        >
                          <i className="lnr lnr-move"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 portfolio-item website all">
                    <div className="portfolio-img">
                      <img
                        src="../../public/assets/images/portfolio/portfolio-img-3.jpeg"
                        className="img-responsive"
                        alt=""
                      />
                    </div>
                    <div className="portfolio-data">
                      <h4>
                        <a href="https://www.globe.com.ph/#gref">Globe One</a>
                      </h4>
                      <p className="meta">Vue.js, SASS</p>
                      <div className="portfolio-attr">
                        <a href="https://www.globe.com.ph/#gref">
                          <i className="lnr lnr-link"></i>
                        </a>
                        <a
                          href="images/portfolio/portfolio-img-3.jpeg"
                          data-rel="lightcase:gal"
                          title="Image Caption"
                        >
                          <i className="lnr lnr-move"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 portfolio-item website all">
                    <div className="portfolio-img">
                      <img
                        src="../../public/assets/images/portfolio/portfolio-img-8.jpeg"
                        className="img-responsive"
                        alt=""
                      />
                    </div>
                    <div className="portfolio-data">
                      <h4>
                        <a>Globe One Webtool</a>
                      </h4>
                      <p className="meta">Vue.js, SASS</p>
                      <div className="portfolio-attr">
                        <a
                          href="images/portfolio/portfolio-img-8.jpeg"
                          data-rel="lightcase:gal"
                          title="Image Caption"
                        >
                          <i className="lnr lnr-move"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 portfolio-item mobile all">
                    <div className="portfolio-img">
                      <img
                        src="../../public/assets/images/portfolio/portfolio-img-4.jpeg"
                        className="img-responsive"
                        alt=""
                      />
                    </div>
                    <div className="portfolio-data">
                      <h4>
                        <a href="https://apps.apple.com/us/app/id1459216958">Globe One</a>
                      </h4>
                      <p className="meta">Native Script (Angular)</p>
                      <div className="portfolio-attr">
                        <a href="https://apps.apple.com/us/app/id1459216958">
                          <i className="lnr lnr-link"></i>
                        </a>
                        <a
                          href="images/portfolio/portfolio-img-4.jpeg"
                          data-rel="lightcase:gal"
                          title="Image Caption"
                        >
                          <i className="lnr lnr-move"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 portfolio-item website all">
                    <div className="portfolio-img">
                      <img
                        src="../../public/assets/images/portfolio/portfolio-img-5.jpeg"
                        className="img-responsive"
                        alt=""
                      />
                    </div>
                    <div className="portfolio-data">
                      <h4>
                        <a href="https://www.facebook.com/skyhelmtech/">SkyHelm (Updated)</a>
                      </h4>
                      <p className="meta">Template, CMS</p>
                      <div className="portfolio-attr">
                        <a href="https://www.facebook.com/skyhelmtech/">
                          <i className="lnr lnr-link"></i>
                        </a>
                        <a
                          href="images/portfolio/portfolio-img-5.jpeg"
                          data-rel="lightcase:gal"
                          title="Image Caption"
                        >
                          <i className="lnr lnr-move"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 portfolio-item website all">
                    <div className="portfolio-img">
                      <img
                        src="../../public/assets/images/portfolio/portfolio-img-6.jpeg"
                        className="img-responsive"
                        alt=""
                      />
                    </div>
                    <div className="portfolio-data">
                      <h4>
                        <a href="https://www.facebook.com/therelever/">Relever (Died)</a>
                      </h4>
                      <p className="meta">WordPress</p>
                      <div className="portfolio-attr">
                        <a href="https://www.facebook.com/therelever/">
                          <i className="lnr lnr-link"></i>
                        </a>
                        <a
                          href="images/portfolio/portfolio-img-6.jpeg"
                          data-rel="lightcase:gal"
                          title="Image Caption"
                        >
                          <i className="lnr lnr-move"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 portfolio-item website mobile all">
                    <div className="portfolio-img">
                      <img
                        src="../../public/assets/images/portfolio/portfolio-img-7.jpeg"
                        className="img-responsive"
                        alt=""
                      />
                    </div>
                    <div className="portfolio-data">
                      <h4>
                        <a href="https://adstudio.blueseed.tv/ads/instream-video">BS Player</a>
                      </h4>
                      <p className="meta">JavaScript</p>
                      <div className="portfolio-attr">
                        <a href="https://adstudio.blueseed.tv/ads/instream-video">
                          <i className="lnr lnr-link"></i>
                        </a>
                        <a
                          href="images/portfolio/portfolio-img-7.jpeg"
                          data-rel="lightcase:gal"
                          title="Image Caption"
                        >
                          <i className="lnr lnr-move"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 portfolio-item website all">
                    <div className="portfolio-img">
                      <img
                        src="../../public/assets/images/portfolio/portfolio-img-8.jpeg"
                        className="img-responsive"
                        alt=""
                      />
                    </div>
                    <div className="portfolio-data">
                      <h4>
                        <a>Globe OC3 Webtool</a>
                      </h4>
                      <p className="meta">Vue.JS, SASS</p>
                      <div className="portfolio-attr">
                        <a
                          href="images/portfolio/portfolio-img-8.jpeg"
                          data-rel="lightcase:gal"
                          title="Image Caption"
                        >
                          <i className="lnr lnr-move"></i>
                        </a>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout.Content>
    </UserLayout>
  );
};

export default ThemePage;
