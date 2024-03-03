import React, { useEffect } from 'react';
import { mutations } from '../../graphql/graphql';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { message } from 'antd';
import { VERIFY_USER_SUCCESSFULLY, SOMETHING_WENT_WRONG } from '../../constants/wording';

const VerifyPage = ({ ...rest }) => {
  const history = useHistory();

  const [VerifyToken] = useMutation(mutations.VERIFY_TOKEN);

  useEffect(() => {
    VerifyToken({ variables: { token: rest.match.params.token } }).then(
      res => {
        message.success(VERIFY_USER_SUCCESSFULLY);
        history.push("/login");
      },
      err => message.error(SOMETHING_WENT_WRONGING_WENT_WRONG)
    )
  }, [rest.match.params.token]);

  return 'loading';
};

export default VerifyPage;
