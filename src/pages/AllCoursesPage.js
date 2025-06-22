import React, { useState, useEffect } from 'react';
import './AllCoursesPage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlobalEnrollModal from '../modal';

const AllCoursesPage = () => {
  const [data, setData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // formData includes courseName now
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    address: '',
    courseName: '',
  });

  useEffect(() => {
    fetch('/json/courses.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch courses');
        return res.json();
      })
      .then((json) => {
        setData(json);
        if (json.categories.length > 0) {
          setActiveCategory(json.categories[0]);
        }
      })
      .catch((err) => {
        console.error('Error loading data:', err);
      });
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you can add your emailjs send or any API call

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
        address: '',
        courseName: '',  // reset courseName on form submit/close
      });
    }, 2000);
  };

  if (!data) return <div className="loading-message">Loading courses...</div>;

  const activeSubcategories = data.subcategories
    .filter((sub) => sub.category === activeCategory)
    .map((sub) => sub.name);

  const filteredCourses = data.courses.filter((course) =>
    activeSubcategories.includes(course.subcategory)
  );

  return (
    <>
      <Header />
      <div className="course-page-container">
        <header className="page-header">
          <h1>All Courses</h1>
          <p>Explore our full range of online courses curated by experts</p>
        </header>

        <section className="course-section">
          <div className="subcategories scrollable">
            {data.categories.map((cat, i) => (
              <div
                key={i}
                className={`pill ${cat === activeCategory ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <strong>{cat}</strong>
              </div>
            ))}
          </div>

          <h2 className="section-heading">📚 Courses in {activeCategory}</h2>
          <div className="course-cards">
            {filteredCourses.map((course, i) => (
              <div className="course-card" key={i}>
                <img src={course.image} alt={course.title} />
                <div className="card-content">
                  <h4 title={course.title}>{course.title}</h4>
                  <p title={course.instructors}>{course.instructors}</p>
                  <div className="rating-price">
                    <span>
                      ⭐ {course.rating} ({course.reviews.toLocaleString()})
                    </span>
                  </div>
                  {course.tag && (
                    <span
                      className={`tag ${course.tag.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {course.tag}
                    </span>
                  )}
                  <button
                    className="enroll-btn"
                    onClick={() => {
                      // Set selected course in formData so modal form knows which course
                      setFormData((prev) => ({ ...prev, courseName: course.title }));
                      setShowModal(true);
                    }}
                    style={{ marginTop: '10px', width: '100%', padding: '10px' }}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
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
