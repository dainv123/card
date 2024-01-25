import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { NavLink } from 'react-router-dom';
import UserLayout from '../../components/Layouts/UserLayout';

const AboutMePage = () => {
  return (
    <UserLayout>
      <Layout.Content>
        <section id="about-me" className="sub-page">
          <div className="sub-page-inner">
            <div className="section-title">
              <div className="main-title">
                <div className="title-main-page">
                  <h4>About me</h4>
                  <p>WHAT DO YOU WANT TO KNOW ABOUT ME?</p>
                </div>
              </div>
            </div>
            <div className="section-content">
              <div className="row pb-30">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <h3>Dai Nguyen</h3>
                  <span className="about-location">
                    <i className="lnr lnr-map-marker"></i>Ho Chi Minh City, Viet Nam
                  </span>
                  <p className="about-content">
                    Hey there! I'm Nguyen Van Dai, a Developer calling Ho Chi
                    Minh city home ☀️. I identify as a passionate developer, embracing the world of
                    coding, open source, and the web platform ❤️.
                  </p>
                  <p className="about-content">
                    Beyond my professional responsibilities, I actively engage in crafting and
                    contributing to open source projects, a practice that not only broadens my
                    knowledge but also aids in the advancement of fellow open source endeavors.
                    Additionally, I take pleasure in sharing my technical insights ✍️ through my
                    blog or{' '}
                    <a href="https://github.com/dainv123" target="_blank">
                      Github
                    </a>
                    .
                  </p>
                  <p className="about-content">
                    During my leisure hours, you'll likely find me backpacking, exploring mountains
                    or beaches 🏖, or attending tech fairs in and around Ho Chi Minh city.
                  </p>
                </div>
                <div className="col-xs-6 col-sm-12 col-md-6 col-lg-6">
                  <div className="box-img">
                    <img
                      src="../../public/assets/../../public/assets/images/about.png"
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
    </UserLayout>
  );
};

export default AboutMePage;
