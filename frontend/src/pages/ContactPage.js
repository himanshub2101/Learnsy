import React, { useState } from 'react';
import './ContactPage.css';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactPage = () => {
  const [phone, setPhone] = useState('');

  return (
    <>
      <Header />
      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-title">
            <h1>Contact Us</h1>
            <p>We’re here to help! Reach out to us with any questions or feedback.</p>
          </div>

          <div className="contact-widgets">
            {/* Left: Contact Details */}
            <div className="contact-widget contact-details">
              <h2>Get in Touch</h2>
              <p><strong>Email:</strong> support@example.com</p>
              <p><strong>Phone:</strong> +91-9876543210</p>
              <p><strong>Address:</strong> 123 LearnX Street, New Delhi, India</p>
            </div>

            {/* Right: Contact Form */}
            <div className="contact-widget contact-form">
              <h2>Send a Message</h2>
              <form>
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />

                <PhoneInput
                  country={'in'}
                  value={phone}
                  onChange={setPhone}
                  inputProps={{
                    name: 'phone',
                    required: true,
                    placeholder: 'Enter phone number',
                  }}
                />

                <textarea placeholder="Your Message" rows="5" required></textarea>
                <button type="submit">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
