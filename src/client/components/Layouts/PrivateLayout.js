import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Avatar, Icon, message } from 'antd';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { mutations } from '../../graphql/graphql';
import actions from '../../store/actions/actions';
import _s from './Layouts.less';
import { COPY_RIGHT } from '../../constants/wording';

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
          defaultSelectedKeys={['/']}
          selectedKeys={[location.pathname]}
          style={{ lineHeight: '65px' }}
        >
          <Menu.Item key="logo">
            <Link to="/">
              <img src="/public/images/logo2.png" alt="menu" className={_s.logo} />
            </Link>
          </Menu.Item>
          <Menu.Item key="/admin">
            <Link to="/admin">Dashboard</Link>
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
              Sign Out
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