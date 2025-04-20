import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
// Không cần import BrowserRouter ở đây nữa
import { Routes, Route } from 'react-router-dom';
// Đảm bảo bạn import đúng các component Route tùy chỉnh đã refactor cho v6
// import PrivateRoute from './components/PrivateRoute/PrivateRoute'; // Tên cũ
// import GuestRoute from './components/GuestRoute/GuestRoute';   // Tên cũ
import ConnectedPrivateRouteElement from './components/PrivateRoute/PrivateRoute'; // Import component đã refactor
import ConnectedGuestRouteElement from './components/GuestRoute/GuestRoute';   // Import component đã refactor

import CheckIfLoggedIn from './components/CheckIfLoggedIn/CheckIfLoggedIn'; // Giữ nguyên component này

// Import các trang components
import LoginPage from './pages/Login/Login';
import RegisterPage from './pages/Register/Register';
import HomePage from './pages/Home/Home';
import AboutMePage from './pages/AboutMe/AboutMe';
import ThemePage from './pages/Theme/Theme';
import BlogPage from './pages/Blog/Blog';
import BlogDetailPage from './pages/Blog/BlogDetail';
import ContactPage from './pages/Contact/Contact';
import ReaderPage from './pages/Reader/Reader';
import VerifyTokenPage from './pages/VerifyToken/VerifyToken'; // Đảm bảo đã refactor component này
import DashboardPage from './pages/Dashboard/Dashboard';
import ProfilePage from './pages/Profile/Profile';
import PageNotFound from './pages/NotFound/NotFound';

const BookApp = lazy(() => import('bookApp/App')); // Giữ nguyên nếu đang dùng Module Federation

const App = () => {
  return (
    // --- SỬA LỖI: XÓA BrowserRouter BỊ LẶP ---
    // <BrowserRouter> // XÓA DÒNG NÀY
      <CheckIfLoggedIn>
        <Routes>
          {/* Sử dụng các component Route tùy chỉnh đã refactor (v6) trong prop 'element' */}
          {/* Truyền component thực tế cần render vào prop 'component' của component Route tùy chỉnh */}

          <Route
            path="/admin/*" // Sử dụng /* nếu các trang admin có sub-route
            element={<ConnectedPrivateRouteElement component={DashboardPage} />} // Sử dụng component đã refactor
          />
          <Route
            path="/admin/profile"
            element={<ConnectedPrivateRouteElement component={ProfilePage} />} // Sử dụng component đã refactor
          />

          <Route path="/login" element={<ConnectedGuestRouteElement component={LoginPage} />} /> {/* Sử dụng component đã refactor */}
          <Route
            path="/register"
            element={<ConnectedGuestRouteElement component={RegisterPage} />} // Sử dụng component đã refactor
          />

          <Route
            path="/book"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <BookApp />
              </Suspense>
            }
          />

          {/* Các Route công khai khác */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about-me" element={<AboutMePage />} />
          <Route path="/theme" element={<ThemePage />} />
          <Route path="/blog" element={<BlogPage />} />
          {/* Cập nhật cú pháp route params cho v6 */}
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Cập nhật cú pháp optional route params cho v6 */}
          <Route path="/reader/:id?" element={<ReaderPage />} />
          {/* Cập nhật cú pháp route params cho v6 */}
          <Route path="/verify-token/:token" element={<VerifyTokenPage />} /> {/* Đảm bảo VerifyTokenPage đã refactor dùng useParams */}

          {/* Route 404 - bắt tất cả các path khác */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </CheckIfLoggedIn>
  );
};

App.propTypes = {
  // history prop không còn được tự động truyền bởi React Router v6.
  // Nếu App component của bạn KHÔNG sử dụng history, location, match props từ Router,
  // bạn có thể xóa propTypes này.
  // history: PropTypes.object
};

export default App;