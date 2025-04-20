import React, { useEffect } from 'react';
// import PropTypes from 'prop-types'; // Giữ lại nếu VerifyPage nhận props khác
import { mutations } from '../../graphql/graphql';
import { useMutation } from '@apollo/client';
// Xóa import useHistory
// import { useHistory } from 'react-router-dom';
// Import useNavigate và useParams thay thế
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
// import { connect } from 'react-redux'; // Giữ lại nếu component này kết nối Redux
// import { bindActionCreators } from 'redux'; // Giữ lại nếu component này kết nối Redux actions
// import actions from '../../store/actions/actions'; // Giữ lại nếu component này kết nối Redux actions
import { VERIFY_USER_SUCCESSFULLY, SOMETHING_WENT_WRONG } from '../../constants/wording';

// Component functional không cần nhận prop 'rest' nếu chỉ dùng để lấy match.params
const VerifyPage = () => {
  // Sử dụng Hook useNavigate thay thế useHistory
  const navigate = useNavigate();
  // Sử dụng Hook useParams để lấy các tham số từ URL route
  const { token } = useParams(); // Lấy trực tiếp 'token' từ URL (ví dụ: /verify/:token)

  // Đảm bảo useMutation từ @apollo/client tương thích với phiên bản Apollo Client hiện tại của bạn
  const [VerifyToken] = useMutation(mutations.VERIFY_TOKEN);

  useEffect(() => {
    // Kiểm tra xem token có tồn tại không trước khi gọi mutation
    if (token) {
      VerifyToken({ variables: { token: token } }).then(
        res => {
          message.success(VERIFY_USER_SUCCESSFULLY);
          // Sử dụng navigate("/login") thay thế history.push("/login")
          navigate("/login");
        },
        err => {
           // Xử lý lỗi, đảm bảo hiển thị thông báo lỗi đúng
           console.error(err); // Log lỗi đầy đủ để debug
           message.error(SOMETHING_WENT_WRONG); // Sử dụng biến wording đúng
           // Có thể chuyển hướng hoặc hiển thị thông báo lỗi cụ thể hơn tùy requirement
        }
      );
    } else {
        // Xử lý trường hợp không có token trong URL
        message.error("Verification token is missing.");
        // Có thể chuyển hướng về trang chủ hoặc trang lỗi
        // navigate('/');
    }

  }, [token, VerifyToken, navigate]); // Thêm token, VerifyToken, và navigate vào dependency array

  // Component này chỉ hiển thị text 'VERIFYING...' trong khi chờ API
  return 'VERIFYING...';
};

// Giữ lại phần Redux connect và PropTypes nếu component này thực sự cần chúng
// Ví dụ:
/*
VerifyPage.propTypes = {
  // ... các PropTypes khác nếu có
};

const mapStateToProps = state => {
  return {
    // ... map state nếu có
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      // ... map actions nếu có
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPage);
*/

// Nếu component này không kết nối Redux, export trực tiếp
export default VerifyPage;