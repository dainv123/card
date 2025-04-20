import React, { useEffect, useState } from 'react';
import { mutations } from '../../graphql/graphql';
import { useMutation } from '@apollo/client';
import { Layout } from 'antd';
import { NavLink } from 'react-router-dom';
import { message as toast } from 'antd';
import PublicLayout from '../../components/Layouts/PublicLayout';
import { CONTACT_MAILBOX } from '../../constants/common';
import {
  CONTACT,
  CONTACT_INTRO,
  EMAIL,
  MESSAGE,
  NAME,
  SEND_MESSAGE,
  SOMETHING_WENT_WRONG,
  SEND_CONTACT_SUCCESSFULLY
} from '../../constants/wording';


const ContactPage = () => {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [message, setMessage] = useState('');

  const [SendContact] = useMutation(mutations.SEND_CONTACT);

  const handleSendMessage = (event) => {
    event.preventDefault();

    SendContact({ variables: { name, email, message } }).then(
      res => toast.success(SEND_CONTACT_SUCCESSFULLY),
      err => toast.error(err.message ? err.message : SOMETHING_WENT_WRONG)
    );
  }

  return (
    <PublicLayout>
      <Layout.Content>
        <section id="contact" className="sub-page">
          <div className="sub-page-inner">
            <div className="section-title">
              <div className="main-title">
                <div className="title-main-page">
                  <h4>{CONTACT}</h4>
                  <p>{CONTACT_INTRO}</p>
                </div>
              </div>
            </div>
            <div className="row contact-form pb-30">
              <div className="col-sm-12 col-md-5 col-lg-5 left-background">
                <img src={CONTACT_MAILBOX} alt="image" />
              </div>
              <div className="col-sm-12 col-md-7 col-lg-7">
                <div className="form-contact-me">
                  <div id="show_contact_msg"></div>
                  <form onSubmit={handleSendMessage}>
                    <input
                      name="name"
                      id="name"
                      type="text"
                      placeholder={NAME + ':'}
                      required
                      autoComplete="off"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                    <input
                      name="email"
                      id="email"
                      type="email"
                      placeholder={EMAIL + ':'}
                      required
                      autoComplete="off"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                    <textarea
                      name="comment"
                      id="comment"
                      placeholder={MESSAGE + ':'}
                      required
                      rows="6"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    ></textarea>
                    <input className="bt-submit" type="submit" value={SEND_MESSAGE} />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout.Content>
    </PublicLayout>
  );
};

export default ContactPage;
