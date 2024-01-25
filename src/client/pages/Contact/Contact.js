import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { NavLink } from 'react-router-dom';
import UserLayout from '../../components/Layouts/UserLayout';

const ContactPage = () => {
  return (
    <UserLayout>
      <Layout.Content>
        <section id="contact" className="sub-page">
          <div className="sub-page-inner">
            <div className="section-title">
              <div className="main-title">
                <div className="title-main-page">
                  <h4>Contact</h4>
                  <p>NEED SOME HELP?</p>
                </div>
              </div>
            </div>
            <div className="row contact-form pb-30">
              <div className="col-sm-12 col-md-5 col-lg-5 left-background">
                <img src="../../public/assets/images/mailbox.png" alt="image" />
              </div>
              <div className="col-sm-12 col-md-7 col-lg-7">
                <div className="form-contact-me">
                  <div id="show_contact_msg"></div>
                  <form method="post" id="contact-form" action="/contact">
                    <input
                      name="name"
                      id="name"
                      type="text"
                      placeholder="Name:"
                      required
                      autocomplete="off"
                    />
                    <input
                      name="email"
                      id="email"
                      type="email"
                      placeholder="Email:"
                      required
                      autocomplete="off"
                    />
                    <textarea
                      name="comment"
                      id="comment"
                      placeholder="Message:"
                      required
                      rows="6"
                    ></textarea>
                    <input className="bt-submit" type="submit" value="Send Message" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout.Content>
    </UserLayout>
  );
};

export default ContactPage;
