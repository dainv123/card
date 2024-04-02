import React from 'react';
import { render, screen } from '@testing-library/react';
import EmailSent from '../../components/EmailSent/EmailSent';
import { EMAIL_SENT, CHECK_EMAIL_PLEASE } from '../../constants/wording';
import '@testing-library/jest-dom/extend-expect'; 

describe('EmailSent component', () => {
  it('renders without crashing', () => {
    render(<EmailSent email="test@example.com" />);
    const emailSentElement = screen.getByText(EMAIL_SENT);
    expect(emailSentElement).toBeInTheDocument();
  });

  it('displays the correct email message', () => {
    const email = 'test@example.com';
    render(<EmailSent email={email} />);
    const emailMessageElement = screen.getByText(CHECK_EMAIL_PLEASE(email));
    expect(emailMessageElement).toBeInTheDocument();
  });
});
