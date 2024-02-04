import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Avatar, Icon, message } from 'antd';
import { NavLink } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { mutations } from '../../graphql/graphql';
import actions from '../../store/actions/actions';
import _s from './Layouts.less';

const { SubMenu } = Menu;

const { Header, Footer, Content } = Layout;

const PublicLayout = React.memo(props => {
  useEffect(() => {
    /*************************
     Responsive Menu
     *************************/
    $('.responsive-icon').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!$(this).hasClass('active')) {
        $(this).addClass('active');
        $('.header').animate({ 'margin-left': 285 }, 300);
      } else {
        $(this).removeClass('active');
        $('.header').animate({ 'margin-left': 0 }, 300);
      }
      return false;
    });

    $('.header a').on('click', function (e) {
      $('.responsive-icon').removeClass('active');
      $('.header').animate({ 'margin-left': 0 }, 300);
    });
  }, []);

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <div className="wrapper-page">
        <header className="header">
          <div className="header-content">
            <div className="profile-picture-block">
              <div className="my-photo">
                <img
                  src="http://localhost:3000/public/assets/images/avatar.jpg"
                  className="img-fluid"
                  alt="image"
                />
              </div>
            </div>
            <div className="site-title-block">
              <div className="site-title">Dai Nguyen</div>
            </div>
            <div className="site-nav">
              <ul className="header-main-menu" id="header-main-menu">
                <li>
                  <NavLink exact activeClassName="active" to="/">
                    <i className="fas fa-home"></i> Home
                  </NavLink>
                </li>
                <li>
                  <NavLink activeClassName="active" to="/about-me">
                    <i className="fas fa-user-tie"></i> About Me
                  </NavLink>
                </li>
                <li>
                  <NavLink activeClassName="active" to="/theme">
                    <i className="fas fa-business-time"></i>Theme
                  </NavLink>
                </li>
                <li>
                  <NavLink activeClassName="active" to="/blog">
                    <i className="fas fa-book-reader"></i> Blog
                  </NavLink>
                </li>
                <li>
                  <NavLink activeClassName="active" to="/contact">
                    <i className="fas fa-paper-plane"></i> Contact
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </header>
        <div className="responsive-header">
          <div className="responsive-header-name">
            <img
              className="responsive-logo"
              src="http://localhost:3000/public/assets/images/avatar.jpg"
              alt=""
            />
            Dai Nguyen
          </div>
          <span className="responsive-icon">
            <i className="lnr lnr-menu"></i>
          </span>
        </div>
        <div className="content-pages">
          <div className="sub-home-pages">
            <Content className={_s.Content}>{props.children}</Content>
          </div>
        </div>
      </div>
    </Layout>
  );
});

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loggedIn: state.auth.loggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      removeAuthUser: actions.removeAuthUser
    },
    dispatch
  );
};

PublicLayout.propTypes = {
  user: PropTypes.object,
  loggedIn: PropTypes.bool.isRequired,
  removeAuthUser: PropTypes.func.isRequired
};

const connectedPublicLayout = connect(mapStateToProps, mapDispatchToProps)(PublicLayout);

export default withRouter(connectedPublicLayout);
