import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Layout } from 'antd';
import { NavLink } from 'react-router-dom';
import PublicLayout from '../../components/Layouts/PublicLayout';

const HomePage = () => {
  const loggedIn = useSelector(state => state.auth.loggedIn);

  useEffect(() => {
    $('.typed').typed({
      stringsElement: $('.typed-strings'),
      typeSpeed: 20,
      backDelay: 500,
      loop: true,
      autoplay: true,
      autoplayTimeout: 500,
      contentType: 'html',
      loopCount: true
    });
  }, []);

  return (
    <PublicLayout>
      <Layout.Content>
        <section id="home" className="sub-page start-page">
          <div className="sub-page-inner">
            <div className="mask"></div>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <div className="title-block">
                  <h2>Hello, I'm Dai Nguyen</h2>
                  <div className="type-wrap">
                    <div className="typed-strings">
                      <span>Senior Web Developer</span>
                      <span>Also, Mobile Developer</span>
                      <span>and</span>
                      <span>Culi in Some Backend Languages</span>
                    </div>
                    <span className="typed"></span>
                  </div>
                  <div className="home-buttons">
                    <NavLink to={loggedIn ? '/admin' : '/login'} className="bt-submit">
                      <i className="lnr lnr-briefcase"></i> {loggedIn ? 'Go to Admin' : 'Login'}
                    </NavLink>
                    <NavLink to="/contact" className="bt-submit">
                      <i className="lnr lnr-envelope"></i> Contact Me
                    </NavLink>
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

export default HomePage;
