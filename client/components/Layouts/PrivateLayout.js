import React from 'react';
import PropTypes from 'prop-types';
import actions from '../../store/actions/actions';
import { Link } from 'react-router-dom';
import { Layout, Menu, Avatar, Icon, message } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { mutations } from '../../graphql/graphql';
import { LOGO_URI } from '../../constants/common';
import { COPY_RIGHT, DASHBOARD, SIGN_OUT } from '../../constants/wording';
import _s from './Layouts.less';

const { SubMenu } = Menu;

const { Header, Footer, Content } = Layout;

const PrivateLayout = props => {
  const userName = props.user ? props.user.name : 'Profile';

  const [LogOut] = useMutation(mutations.LOG_OUT);

  const handleLogOut = e => {
    if (e.key === 'LogOut') {
      LogOut()
        .then(res => {
          props.removeAuthUser();
          message.success('Logged out successfully');
          props.history.push('/');
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header style={{ height: 'unset' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: '65px' }}
          defaultSelectedKeys={['/']}
          selectedKeys={[location.pathname]}
        >
          <Menu.Item key="logo">
            <Link to="/">
              <img src={LOGO_URI} alt="menu" className={_s.logo} />
            </Link>
          </Menu.Item>
          <Menu.Item key="/admin">
            <Link to="/admin">{DASHBOARD}</Link>
          </Menu.Item>
          <SubMenu
            title={
              <>
                <Avatar size="medium" icon="user" className={_s.UserAvatar} />
                <Icon type="down" style={{ marginLeft: '10px' }} />
              </>
            }
            style={{ float: 'right' }}
          >
            <Menu.Item key="profile">
              <Link to="/admin/profile">{userName}</Link>
            </Menu.Item>
            <Menu.Item onClick={e => handleLogOut(e)} key="LogOut">
              {SIGN_OUT}
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Header>
      <Content className={_s.Content}>{props.children}</Content>
      <Footer style={{ textAlign: 'center' }}>{COPY_RIGHT}</Footer>
    </Layout>
  );
};

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

PrivateLayout.propTypes = {
  user: PropTypes.object,
  loggedIn: PropTypes.bool.isRequired,
  removeAuthUser: PropTypes.func.isRequired
};

const connectedPrivateLayout = connect(mapStateToProps, mapDispatchToProps)(PrivateLayout);

export default withRouter(connectedPrivateLayout);
