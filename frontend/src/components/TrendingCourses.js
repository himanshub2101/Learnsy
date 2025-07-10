import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './TrendingCourses.css';
import '../modal.css';
import GlobalEnrollModal from '../modal';
import api from '../api/axios'; // ⬅ axios instance with baseURL

const TABS = [
  { key: 'trending', label: '🔥 Trending' },
  { key: 'best', label: '💎 Best Choice' },
  { key: 'premium', label: '🌟 Premium' }
];

const TrendingCourses = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '',
    phone: '', alternatePhone: '', email: '', address: '',
    courseName: ''
  });

  const navigate = useNavigate(); // Hook for navigation

  /* ─────────── Fetch on Tab Switch ─────────── */
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        let params = { limit: 6 };

        if (activeTab === 'trending') {
          params.sort = 'created_at';
        } else if (activeTab === 'best') {
          params.sort = 'rating';
        } else if (activeTab === 'premium') {
          params.tag = 'premium';
        }

        const { data } = await api.get('/courses', { params });
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [activeTab]);

  /* ─────────── Enroll Modal Helpers ─────────── */
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setShowModal(false);
      setFormData((p) => ({ ...p, courseName: '' }));
    }, 2000);
  };

  /* ─────────── Handle Enroll Click ─────────── */
  const handleEnrollClick = (courseId) => {
    // Redirect to course details page with course ID
    navigate(`/course-details/${courseId}`);
  };

  /* ─────────── JSX ─────────── */
  return (
    <section className="trending-section">
      {/* Tabs */}
      <div className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-message">Fetching courses…</div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <div className="course-card" key={course.id}>
              <img src={course.thumbnail_url || '/placeholder.jpg'} alt={course.title} />
              <div className="course-info">
                {course.tag && <span className="course-tag">{course.tag}</span>}
                <h3>{course.title}</h3>
                {course.description_md && <p>{course.description_md.slice(0, 80)}…</p>}
                <div className="course-footer">
                  <span className="price">
                    ${course.price ? course.price.toFixed(2) : 'Free'}
                  </span>
                  <button
                    className="enroll-btn"
                    onClick={() => handleEnrollClick(course.id)} // Redirect on click
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!courses.length && <p>No courses found in this tab.</p>}
        </div>
      )}

      {/* Modal */}
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