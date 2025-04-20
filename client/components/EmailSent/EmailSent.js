import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Card } from 'antd';
import { EMAIL_SENT, CHECK_EMAIL_PLEASE } from '../../constants/wording';
import _s from './EmailSent.less';
import { MailOutlined } from '@ant-design/icons';

const EmailSent = props => {
  return (
    <Card className={_s.EmailSentCard}>
      <p style={{ fontWeight: 'bold', fontSize: '1.05rem', textAlign: 'center' }}>
        <MailOutlined style={{ paddingRight: '5px' }} /> {EMAIL_SENT}
      </p>
      {CHECK_EMAIL_PLEASE(props.email)}
    </Card>
  );
};

EmailSent.propTypes = {
  email: PropTypes.string.isRequired
};

export default EmailSent;
