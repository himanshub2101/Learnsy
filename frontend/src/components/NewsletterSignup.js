import React from "react";
import "./NewsletterSignup.css";

const NewsletterSignup = () => {
  return (
    <section className="newsletter-section">
      <div className="newsletter-card">
        <h2 className="newsletter-heading">📬 Stay in the Loop</h2>
        <p className="newsletter-subtext">
          Subscribe to get updates on new courses, blog posts, and offers.
        </p>
        <form className="newsletter-form">
          <input
            type="email"
            placeholder="Your email"
            className="newsletter-input"
          />
          <button type="submit" className="newsletter-button">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;