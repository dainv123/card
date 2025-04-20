import React from 'react';
import PropTypes from 'prop-types';
import actions from '../../store/actions/actions';
// Import useLocation và useNavigate từ react-router-dom
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Loại bỏ Icon cũ từ 'antd', chỉ giữ lại những components cần thiết
import { Layout, Menu, Avatar, message } from 'antd';
import { useMutation } from '@apollo/client';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Xóa import withRouter
// import { withRouter } from 'react-router';
import { mutations } from '../../graphql/graphql';
import { LOGO_URI } from '../../constants/common';
import { COPY_RIGHT, DASHBOARD, SIGN_OUT } from '../../constants/wording';
import _s from './Layouts.less';
// Import các icons mới từ @ant-design/icons
import { DownOutlined, UserOutlined } from '@ant-design/icons'; // Thêm UserOutlined

const { SubMenu } = Menu;
const { Header, Footer, Content } = Layout;

// Component PrivateLayout không còn nhận props từ withRouter
const PrivateLayout = props => {
  // Sử dụng Hook useLocation để lấy đối tượng location (thay thế props.location)
  const location = useLocation();
  // Sử dụng Hook useNavigate để lấy hàm navigate (thay thế props.history)
  const navigate = useNavigate();

  const userName = props.user ? props.user.name : 'Profile';

  // Đảm bảo useMutation từ @apollo/client tương thích với phiên bản Apollo Client hiện tại của bạn
  const [LogOut] = useMutation(mutations.LOG_OUT);

  const handleLogOut = e => {
    if (e.key === 'LogOut') {
      LogOut()
        .then(res => {
          props.removeAuthUser();
          message.success('Logged out successfully');
          // Sử dụng navigate('/') thay thế props.history.push('/')
          navigate('/');
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
          // Sử dụng location.pathname từ hook
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
                {/* Sử dụng component icon mới trong prop icon của Avatar */}
                <Avatar size="medium" icon={<UserOutlined />} className={_s.UserAvatar} />
                {/* DownOutlined đã đúng */}
                <DownOutlined style={{ marginLeft: '10px' }} />
              </>
            }
            style={{ float: 'right' }}
          >
            <Menu.Item key="profile">
              <Link to="/admin/profile">{userName}</Link>
            </Menu.Item>
            <Menu.Item onClick={handleLogOut} key="LogOut">
              {SIGN_OUT}
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Header>
      {/* props.children vẫn hoạt động bình thường */}
      <Content className={_s.Content}>{props.children}</Content>
      <Footer style={{ textAlign: 'center' }}>{COPY_RIGHT}</Footer>
    </Layout>
  );
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loggedIn: state.auth.loggedIn // Giữ lại loggedIn nếu PrivateLayout cần logic dựa trên nó
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
  loggedIn: PropTypes.bool.isRequired, // Giữ lại nếu mapStateToProps cung cấp
  removeAuthUser: PropTypes.func.isRequired
};

// Kết nối component PrivateLayout với Redux
const connectedPrivateLayout = connect(mapStateToProps, mapDispatchToProps)(PrivateLayout);

// Export component đã kết nối trực tiếp, không cần bọc với withRouter nữa
export default connectedPrivateLayout;