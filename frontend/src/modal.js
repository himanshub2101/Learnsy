import React from 'react';
import './modal.css';
import emailjs from 'emailjs-com';

const GlobalEnrollModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  onChange,
  formSubmitted,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>&times;</button>
        {!formSubmitted ? (
          <form onSubmit={onSubmit} className="enroll-form">
            <h3>Enroll Now</h3>

            <div className="form-row-3">
              <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={onChange} />
              <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={onChange} />
              <input type="text" name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={onChange} />
            </div>

            <input type="tel" name="phone" placeholder="Mobile Number" required value={formData.phone} onChange={onChange} />
            <input type="tel" name="alternatePhone" placeholder="Alternate Mobile Number" value={formData.alternatePhone} onChange={onChange} />
            <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={onChange} />
            <textarea name="address" rows="3" placeholder="Full Address" required value={formData.address} onChange={onChange}></textarea>

            <button type="submit">Submit</button>
          </form>
        ) : (
          <div className="success-message">
            <div className="checkmark">✅</div>
            <p>We will contact you shortly</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalEnrollModal;
