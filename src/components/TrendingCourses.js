import React, { useEffect, useState } from 'react';
import './TrendingCourses.css';
import '../modal.css';
import GlobalEnrollModal from '../modal'; // adjust path as needed

const TrendingCourses = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    fetch('/json/trendingCourses.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch courses');
        return res.json();
      })
      .then((data) => setCourses(data))
      .catch((err) => console.error('Error:', err));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setFormSubmitted(false);
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        phone: '',
        alternatePhone: '',
        email: '',
        address: ''
      });
    }, 2000);
  };

  return (
    <section className="trending-section">
      <h2 className="section-title">🔥 Top Trending Courses</h2>
      <div className="course-grid">
        {courses.map((course, index) => (
          <div className="course-card" key={index}>
            <img src={course.image} alt={course.title} />
            <div className="course-info">
              <span className="course-tag">{course.tag}</span>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-footer">
                <button className="enroll-btn" onClick={() => setShowModal(true)}>Enroll Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <GlobalEnrollModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        formData={formData}
        formSubmitted={formSubmitted}
      />
    </section>
  );
};

export default TrendingCourses;
