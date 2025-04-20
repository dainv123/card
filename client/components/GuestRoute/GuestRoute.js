import React from 'react';
import PropTypes from 'prop-types';
// Xóa import Route và Redirect cũ
// import { Route, Redirect } from 'react-router-dom';
// Import Navigate, useLocation, và useParams nếu component được render cần params
import { Navigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

// Tên component này được đổi để làm rõ vai trò mới của nó
// Nó sẽ là 'element' được render bởi <Route> trong file routes chính
const GuestRouteElement = ({ component: Component, loggedIn, user, ...rest }) => {
  // Sử dụng hook useLocation để lấy đối tượng location hiện tại trong React Router v6
  const location = useLocation();

  // Nếu cần truy cập các tham số URL (params) trong component được bảo vệ:
  // const params = useParams();
  // Lưu ý: Component được bảo vệ (Component) nếu cần params cũng sẽ dùng hook useParams() của chính nó.

  // Logic kiểm tra trạng thái đăng nhập
  if (loggedIn) {
    // Nếu đã đăng nhập, chuyển hướng đến trang admin
    // Sử dụng component Navigate thay cho Redirect
    // 'replace={true}' để thay thế entry hiện tại trong history stack
    // 'state: { from: location }' để lưu lại đường dẫn gốc trước khi redirect (giống v5)
    return <Navigate to={{ pathname: '/admin', state: { from: location } }} replace={true} />;
  }

  // Nếu chưa đăng nhập, render component thực tế
  // Truyền các props gốc mà GuestRoute nhận được (ngoại trừ các props nội bộ của react-router v5)
  // Ví dụ: truyền prop 'user' từ redux nếu component cần nó
  // Các props của route (như params) sẽ được component 'Component' tự lấy bằng hooks nếu cần
  return <Component {...rest} user={user} />;
};

// Kết nối component này với Redux để lấy trạng thái đăng nhập
const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loggedIn: state.auth.loggedIn
  };
};

// Định nghĩa PropTypes cho component GuestRouteElement
GuestRouteElement.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  // component là prop nhận component React cần render khi route khớp và chưa login
  component: PropTypes.elementType.isRequired,
  user: PropTypes.object,
  // Thêm prop redirectTo nếu bạn muốn cấu hình đường dẫn chuyển hướng từ bên ngoài
  redirectTo: PropTypes.string
};

// Kết nối component với Redux
const ConnectedGuestRouteElement = connect(mapStateToProps)(GuestRouteElement);

// Bây giờ, trong file định nghĩa các Routes chính của ứng dụng (nơi bạn dùng <Routes> và <Route>):
// Thay vì <Route path="/some-path" component={SomeGuestPage} />
// Bạn sẽ sử dụng component ConnectedGuestRouteElement trong prop 'element' của <Route>:
// import ConnectedGuestRouteElement from './path/to/this/file'; // Import component đã kết nối Redux
// import SomeGuestPage from './path/to/SomeGuestPage'; // Import component thực tế cần bảo vệ

/*
// Ví dụ cách sử dụng trong file routes chính (ví dụ: App.js hoặc Routes.js)
import { Routes, Route } from 'react-router-dom';
import ConnectedGuestRouteElement from './GuestRouteElement'; // Đảm bảo đúng đường dẫn import
import LoginPage from './LoginPage'; // Ví dụ: component trang cần truy cập khi chưa login
import AdminDashboard from './AdminDashboard'; // Ví dụ: component trang admin (chuyển hướng đến đây khi đã login)

function AppRoutes() {
  return (
    <Routes>
      // Route ví dụ cho trang chỉ dành cho khách (chưa login)
      // Nếu user đã login khi truy cập '/login', GuestRouteElement sẽ chuyển hướng đến '/admin'
      <Route
        path="/login" // Đường dẫn mà Route này sẽ khớp
        element={<ConnectedGuestRouteElement component={LoginPage} redirectTo="/admin" />}
      />

      // Các route khác của ứng dụng...
      // Ví dụ: Route được bảo vệ (chỉ cho user đã login) sẽ cần component tương tự là PrivateRouteElement
      // <Route
      //   path="/admin/*"
      //   element={<ConnectedPrivateRouteElement component={AdminDashboard} redirectTo="/login" />}
      // />

    </Routes>
  );
}
*/

// Xuất component đã kết nối Redux để sử dụng trong file định nghĩa routes chính
export default ConnectedGuestRouteElement;