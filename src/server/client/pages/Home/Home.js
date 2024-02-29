import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Layout } from 'antd';
import { NavLink } from 'react-router-dom';
import PublicLayout from '../../components/Layouts/PublicLayout';
import { MY_NAME } from '../../constants/common';
import { 
  AND, 
  BACKEND_DEVELOPER, 
  CONTACT_ME, 
  GO_TO_ADMIN, 
  HELLO_NAME, 
  LOG_IN, 
  MOBILE_DEVELOPER, 
  WEB_DEVELOPER 
} from '../../constants/wording';

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
                  <h2>{HELLO_NAME(MY_NAME)}</h2>
                  <div className="type-wrap">
                    <div className="typed-strings">
                      <span>{WEB_DEVELOPER}</span>
                      <span>{MOBILE_DEVELOPER}</span>
                      <span>{AND}</span>
                      <span>{BACKEND_DEVELOPER}</span>
                    </div>
                    <span className="typed"></span>
                  </div>
                  <div className="home-buttons">
                    <NavLink to={loggedIn ? '/admin' : '/login'} className="bt-submit">
                      <i className="lnr lnr-briefcase"></i> {loggedIn ? GO_TO_ADMIN : LOG_IN}
                    </NavLink>
                    <NavLink to="/contact" className="bt-submit">
                      <i className="lnr lnr-envelope"></i> {CONTACT_ME}
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
