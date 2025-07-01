import React, { useState, useEffect } from 'react';
import './AllCoursesPage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlobalEnrollModal from '../modal';
import api from '../api/axios';

const AllCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', phone: '',
    alternatePhone: '', email: '', address: '', courseName: ''
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const handleInputChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

const handleSubmit = async e => {
  e.preventDefault();

  try {
    const course = courses.find(c => c.title === formData.courseName);
    if (!course) throw new Error("Course not found for enrollment");

    await api.post("/enrollments", {
      first_name: formData.firstName,
      middle_name: formData.middleName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      alternate_phone: formData.alternatePhone,
      address: formData.address,
      course_id: course.id,
    });

    alert("Enrolled successfully!");
    setFormSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setFormSubmitted(false);
      setFormData({
        firstName: '', middleName: '', lastName: '', phone: '',
        alternatePhone: '', email: '', address: '', courseName: ''
      });
    }, 1500);
  } catch (err) {
    console.error("Enrollment error:", err);
    alert("Enrollment failed. Please try again.");
  }
};


  return (
    <>
      <Header />
      <div className="course-page-container">
        <header className="page-header">
          <h1>All Courses</h1>
          <p>Explore our full range of online courses curated by experts</p>
        </header>

        <section className="course-section">
          <h2 className="section-heading">📚 All Courses</h2>
          <div className="course-cards">
            {courses.length ? courses.map(course => (
              <div className="course-card" key={course.id}>
                <img src={course.thumbnail_url || '/placeholder.jpg'} alt={course.title} />
                <div className="card-content">
                  <h4>{course.title}</h4>
                  <p>{course.description_md?.slice(0, 80)}...</p>
                  <div className="rating-price">
                    <span>💵 ${course.price_usd || 0}</span>
                  </div>
                  <button
                    className="enroll-btn"
                    onClick={() => {
                      setFormData(p => ({ ...p, courseName: course.title }));
                      setShowModal(true);
                    }}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            )) : (
              <p style={{ marginTop: '1rem' }}>No courses found.</p>
            )}
          </div>
        </section>
      </div>

      <GlobalEnrollModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        formData={formData}
        formSubmitted={formSubmitted}
      />

      <Footer />
    </>
  );
};

export default AllCoursesPage;
