import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import actions from '../../store/actions/actions'; // Giữ nguyên import Redux actions
// Sử dụng NavLink từ react-router-dom
// Loại bỏ useLocation/useNavigate nếu PublicLayout không cần truy cập location/history (dựa trên code hiện tại)
import { NavLink } from 'react-router-dom';
// Loại bỏ Icon cũ từ 'antd', chỉ giữ lại những components cần thiết
import { Layout, Menu, Avatar, message } from 'antd';
import { useMutation } from '@apollo/client'; // Giữ nguyên import Apollo
import { connect } from 'react-redux'; // Giữ nguyên import Redux connect
import { bindActionCreators } from 'redux'; // Giữ nguyên import Redux
// Xóa import withRouter
// import { withRouter } from 'react-router';
import { mutations } from '../../graphql/graphql'; // Giữ nguyên import GraphQL
import _s from './Layouts.less'; // Giữ nguyên import CSS Modules/Less
import { AVATAR_URI, MY_NAME } from '../../constants/common';
import { ABOUT_ME, BLOG, CONTACT, HOME, THEME } from '../../constants/wording';
// Không có icons Ant Design được dùng trong JSX này ngoài Avatar icon, DownOutlined
// Đảm bảo UserOutlined (cho Avatar icon="user") và DownOutlined đã được import đúng nơi cần thiết
// import { UserOutlined, DownOutlined } from '@ant-design/icons'; // Ví dụ icons có thể cần

const { SubMenu } = Menu;
const { Header, Footer, Content } = Layout;

// Component PublicLayout không còn nhận props từ withRouter
const PublicLayout = React.memo(props => {

  // --- LƯU Ý QUAN TRỌNG: PHẦN JQUERY NÀY LÀ ANTI-PATTERN TRONG REACT ---
  // Việc thao tác trực tiếp DOM bằng jQuery bỏ qua Virtual DOM của React.
  // Điều này có thể gây ra các hành vi không mong muốn hoặc khó debug,
  // đặc biệt khi kết hợp với các thư viện quản lý DOM khác như React Router.
  // KHUYẾN NGHỊ: Nên refactor logic này sang sử dụng state và event handling của React.
  useEffect(() => {
    /*************************
      Responsive Menu (jQuery) - Cần refactor sang React
      *************************/
    // Giữ nguyên code này TẠM THỜI nếu chưa refactor, nhưng cần hiểu rủi ro
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

    // Cleanup function cho useEffect
    return () => {
      // Quan trọng: Gỡ bỏ event handlers khi component unmount
      $('.responsive-icon').off('click');
      $('.header a').off('click');
      // Có thể cần reset lại style DOM nếu nó bị thay đổi vĩnh viễn bởi animate
      $('.header').css('margin-left', ''); // Reset style
    };

  }, []); // [] đảm bảo effect chạy 1 lần sau render đầu tiên và cleanup khi unmount

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      {/* Phần JSX khác giữ nguyên cấu trúc */}
      <div className="wrapper-page">
        <header className="header">
          <div className="header-content">
            <div className="profile-picture-block">
              <div className="my-photo">
                <img
                  src={AVATAR_URI}
                  alt="avatar"
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="site-title-block">
              <div className="site-title">{MY_NAME}</div>
            </div>
            <div className="site-nav">
              <ul className="header-main-menu" id="header-main-menu">
                <li>
                  {/* Sử dụng NavLink v6: className function thay activeClassName và bỏ exact */}
                  <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? 'active' : ''}
                    // Bỏ prop 'exact' trong v6 NavLink
                  >
                    {/* Icon Font Awesome - không thuộc Ant Design Icons */}
                    <i className="fas fa-home"></i> {HOME}
                  </NavLink>
                </li>
                <li>
                  {/* Sử dụng NavLink v6 */}
                  <NavLink
                    to="/about-me"
                    className={({ isActive }) => isActive ? 'active' : ''}
                  >
                    <i className="fas fa-user-tie"></i> {ABOUT_ME}
                  </NavLink>
                </li>
                <li>
                   {/* Sử dụng NavLink v6 */}
                  <NavLink
                    to="/theme"
                    className={({ isActive }) => isActive ? 'active' : ''}
                  >
                    <i className="fas fa-business-time"></i> {THEME}
                  </NavLink>
                </li>
                <li>
                   {/* Sử dụng NavLink v6 */}
                  <NavLink
                    to="/blog"
                    className={({ isActive }) => isActive ? 'active' : ''}
                  >
                    <i className="fas fa-book-reader"></i> {BLOG}
                  </NavLink>
                </li>
                 <li>
                   {/* Sử dụng NavLink v6 */}
                  <NavLink
                    to="/contact"
                    className={({ isActive }) => isActive ? 'active' : ''}
                  >
                    <i className="fas fa-paper-plane"></i> {CONTACT}
                  </NavLink>
                </li>
                 {/* Nếu có Menu.Item cho Login/Admin ở đây, cần kiểm tra và cập nhật Link/NavLink và icons */}
              </ul>
            </div>
          </div>
        </header>
         <div className="responsive-header">
           <div className="responsive-header-name">
             <img
               className="responsive-logo"
               src={AVATAR_URI}
             />
             {MY_NAME}
           </div>
           <span className="responsive-icon">
             {/* Icon Lnr - không thuộc Ant Design Icons */}
             <i className="lnr lnr-menu"></i>
           </span>
         </div>
         <div className="content-pages">
           <div className="sub-home-pages">
             {/* props.children là nội dung chính của trang */}
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
  removeAuthUser: PropTypes.func.isRequired,
  // Nếu component này nhận các props từ withRouter trong v5 (như history, location),
  // bạn có thể xóa chúng khỏi PropTypes nếu không còn dùng hooks tương ứng trong v6
  // history: PropTypes.object,
  // location: PropTypes.object,
  // match: PropTypes.object,
};

const connectedPublicLayout = connect(mapStateToProps, mapDispatchToProps)(PublicLayout);

// Export component đã kết nối trực tiếp, không cần bọc với withRouter nữa
export default connectedPublicLayout;