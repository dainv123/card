import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { NavLink } from 'react-router-dom';
import PublicLayout from '../../components/Layouts/PublicLayout';
import { CONTACT_MAILBOX } from '../../constants/common';
import { 
  CONTACT, 
  CONTACT_INTRO, 
  EMAIL, 
  MESSAGE, 
  NAME, 
  SEND_MESSAGE 
} from '../../constants/wording';

const ContactPage = () => {
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
                  <form method="post" id="contact-form" action="/contact">
                    <input
                      name="name"
                      id="name"
                      type="text"
                      placeholder={NAME + ':'}
                      required
                      autoComplete="off"
                    />
                    <input
                      name="email"
                      id="email"
                      type="email"
                      placeholder={EMAIL + ':'}
                      required
                      autoComplete="off"
                    />
                    <textarea
                      name="comment"
                      id="comment"
                      placeholder={MESSAGE + ':'}
                      required
                      rows="6"
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
