import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';        // ← make sure path is right
import './TrendingCourses.css';          // keep your old styles – few extra classes added
import '../modal.css';
import GlobalEnrollModal from '../modal';

const TABS = [
  { key: 'trending',   label: '🔥 Trending'        },
  { key: 'best',       label: '💎 Best Choice'     },
  { key: 'premium',    label: '🌟 Premium'         }
];

const TrendingCourses = () => {
  const [activeTab,     setActiveTab]     = useState(TABS[0].key);
  const [courses,       setCourses]       = useState([]);
  const [loading,       setLoading]       = useState(true);

  /* ────────── enroll modal state ────────── */
  const [showModal,     setShowModal]     = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData,      setFormData]      = useState({
    firstName:'', middleName:'', lastName:'',
    phone:'', alternatePhone:'', email:'', address:'',
    courseName:''
  });

  /* ────────── fetch on tab change ────────── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      let q;

      if (activeTab === 'trending') {
        // latest courses
        q = query(collection(db,'courses'), orderBy('createdAt','desc'), limit(6));
      } else if (activeTab === 'best') {
        // highest rated
        q = query(collection(db,'courses'), orderBy('rating','desc'), limit(6));
      } else { // premium
        // tag OR flag
        q = query(
          collection(db,'courses'),
          where('tags', 'array-contains', 'premium'),  // if you store tags array
          limit(6)
        );
      }

      const snap  = await getDocs(q);
      const list  = snap.docs.map(d=>({id:d.id,...d.data()}));
      setCourses(list);
      setLoading(false);
    })();
  }, [activeTab]);

  /* ────────── modal helpers ────────── */
  const handleInputChange = e => setFormData({...formData,[e.target.name]:e.target.value});
  const handleSubmit = e => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(()=>{
      setShowModal(false); setFormSubmitted(false);
      setFormData(p=>({...p,firstName:'',middleName:'',lastName:'',
        phone:'',alternatePhone:'',email:'',address:''}));
    },2000);
  };

  /* ────────── JSX ────────── */
  return (
    <section className="trending-section">
      {/* Tabs */}
      <div className="tab-bar">
        {TABS.map(t=>(
          <button
            key={t.key}
            className={`tab-btn ${activeTab===t.key ? 'active' : ''}`}
            onClick={()=>setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-message">Fetching courses…</div>
      ) : (
        <div className="course-grid">
          {courses.map(course=>(
            <div className="course-card" key={course.id}>
              <img src={course.thumbnailURL || '/placeholder.jpg'} alt={course.title}/>
              <div className="course-info">
                {course.tags?.[0] && (
                  <span className="course-tag">{course.tags[0]}</span>
                )}
                <h3>{course.title}</h3>
                {course.description && <p>{course.description}</p>}
                <div className="course-footer">
                  <button
                    className="enroll-btn"
                    onClick={()=>{
                      setFormData(p=>({...p,courseName:course.title}));
                      setShowModal(true);
                    }}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!courses.length && <p>No courses found in this tab yet.</p>}
        </div>
      )}

      {/* enroll modal */}
      <GlobalEnrollModal
        show={showModal}
        onClose={()=>setShowModal(false)}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        formData={formData}
        formSubmitted={formSubmitted}
      />
    </section>
  );
};

export default TrendingCourses;
