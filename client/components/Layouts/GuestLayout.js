import React from 'react';
import { Layout, Menu } from 'antd'; 
import { Link, useLocation } from 'react-router-dom'; 
import { LOGO_URI } from '../../constants/common';
import { COPY_RIGHT, LOG_IN } from '../../constants/wording';
import _s from './Layouts.less';
import { LoginOutlined } from '@ant-design/icons'; 

const { Header, Footer, Content } = Layout;

const GuestLayout = props => {  
  const location = useLocation();

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
          <Menu.Item key="/login" className={_s.login}>
            <Link to="/login" style={{ fontWeight: '500' }}>
              {LOG_IN}
              <LoginOutlined style={{ marginLeft: '10px' }} className={_s.loginIcon} />
            </Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content className={_s.Content}>{props.children}</Content>
      <Footer style={{ textAlign: 'center' }}>{COPY_RIGHT}</Footer>
    </Layout>
  );
};


export default GuestLayout;