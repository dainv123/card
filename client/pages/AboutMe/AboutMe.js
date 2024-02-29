import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { NavLink } from 'react-router-dom';
import PublicLayout from '../../components/Layouts/PublicLayout';
import { 
  ABOUT_ME_IMAGE, 
  MY_GITHUB, 
  MY_NAME 
} from '../../constants/common';
import { 
  GITHUB, 
  ABOUT_ME, 
  ABOUT_ME_INTRO, 
  ABOUT_ME_ADDRESS, 
  ABOUT_ME_CONTENT_1, 
  ABOUT_ME_CONTENT_2, 
  ABOUT_ME_CONTENT_3 
} 
from '../../constants/wording';

const AboutMePage = () => {
  return (
    <PublicLayout>
      <Layout.Content>
        <section id="about-me" className="sub-page">
          <div className="sub-page-inner">
            <div className="section-title">
              <div className="main-title">
                <div className="title-main-page">
                  <h4>{ABOUT_ME}</h4>
                  <p>{ABOUT_ME_INTRO}</p>
                </div>
              </div>
            </div>
            <div className="section-content">
              <div className="row pb-30">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <h3>{MY_NAME}</h3>
                  <span className="about-location">
                    <i className="lnr lnr-map-marker"></i>{ABOUT_ME_ADDRESS}
                  </span>
                  <p className="about-content">
                    {ABOUT_ME_CONTENT_1}
                  </p>
                  <p className="about-content">
                    {ABOUT_ME_CONTENT_2}{' '}
                    <a href={MY_GITHUB} target="_blank">{GITHUB}</a>.
                  </p>
                  <p className="about-content">
                    {ABOUT_ME_CONTENT_3}
                  </p>
                </div>
                <div className="col-xs-6 col-sm-12 col-md-6 col-lg-6">
                  <div className="box-img">
                    <img
                      src={ABOUT_ME_IMAGE}
                      className="img-fluid"
                      alt="image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout.Content>
    </PublicLayout>
  );
};

export default AboutMePage;
