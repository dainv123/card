import React from 'react';
import PropTypes from 'prop-types';
// Xóa import Route và Redirect cũ
// import { Route, Redirect } from 'react-router-dom';
// Import Navigate và useLocation
import { Navigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

// Đổi tên component để làm rõ nó là element cho <Route>
const PrivateRouteElement = ({ component: Component, loggedIn, user, redirectTo = '/login', ...rest }) => {
  // Sử dụng hook useLocation để lấy đối tượng location hiện tại
  const location = useLocation();

  // Logic kiểm tra trạng thái đăng nhập
  if (!loggedIn) {
    // Nếu CHƯA đăng nhập, chuyển hướng đến trang login
    // Sử dụng component Navigate thay cho Redirect
    // 'replace={true}' để thay thế entry hiện tại trong history stack
    // 'state: { from: location }' để lưu lại đường dẫn gốc trước khi redirect
    return <Navigate to={{ pathname: redirectTo, state: { from: location } }} replace={true} />;
  }

  // Nếu ĐÃ đăng nhập, render component thực tế
  // '...rest' sẽ chứa bất kỳ props nào khác được truyền vào PrivateRouteElement từ <Route element={...}>
  // 'user' prop được truyền từ Redux
  // Component được render (Component) nếu cần các thông tin từ route (như params) sẽ tự lấy bằng hooks (useParams, useLocation).
  return <Component {...rest} user={user} />;
};

// Kết nối component này với Redux để lấy trạng thái đăng nhập và thông tin user
const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loggedIn: state.auth.loggedIn
  };
};

// Định nghĩa PropTypes cho component PrivateRouteElement
PrivateRouteElement.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  // component là prop nhận component React cần render khi route khớp VÀ user ĐÃ login
  component: PropTypes.elementType.isRequired,
  user: PropTypes.object,
  // Prop redirectTo để cấu hình đường dẫn chuyển hướng khi user chưa login (mặc định là '/login')
  redirectTo: PropTypes.string
  // Nếu bạn truyền các props khác từ <Route element={...}> xuống component thực tế,
  // bạn có thể cần thêm propTypes cho chúng ở đây hoặc trong component thực tế.
};

// Kết nối component với Redux
const ConnectedPrivateRouteElement = connect(mapStateToProps)(PrivateRouteElement);

// Bây giờ, trong file định nghĩa các Routes chính của ứng dụng (nơi bạn dùng <Routes> và <Route>):
// Thay vì <Route path="/admin" component={AdminDashboard} />
// Bạn sẽ sử dụng component ConnectedPrivateRouteElement trong prop 'element' của <Route>:
// import ConnectedPrivateRouteElement from './path/to/this/file'; // Import component đã kết nối Redux
// import AdminDashboard from './path/to/AdminDashboard'; // Import component thực tế cần bảo vệ

/*
// Ví dụ cách sử dụng trong file routes chính (ví dụ: App.js hoặc Routes.js)
import { Routes, Route } from 'react-router-dom';
import ConnectedPrivateRouteElement from './PrivateRouteElement'; // Đảm bảo đúng đường dẫn import
import AdminDashboard from './AdminDashboard'; // Component trang admin
import LoginPage from './LoginPage'; // Component trang login

function AppRoutes() {
  return (
    <Routes>
      // ... các route khác

      // Route ví dụ cho trang admin (chỉ dành cho user đã login)
      // Nếu user CHƯA login khi truy cập '/admin', PrivateRouteElement sẽ chuyển hướng đến '/login'
      <Route
        path="/admin/*" // Sử dụng /* để khớp với các sub-route bên trong admin
        element={<ConnectedPrivateRouteElement component={AdminDashboard} redirectTo="/login" />}
      />

      // Route cho trang login (có thể dùng GuestRouteElement ở đây)
      // <Route
      //    path="/login"
      //    element={<ConnectedGuestRouteElement component={LoginPage} redirectTo="/admin" />}
      // />

    </Routes>
  );
}
*/

// Xuất component đã kết nối Redux để sử dụng trong file định nghĩa routes chính
export default ConnectedPrivateRouteElement;