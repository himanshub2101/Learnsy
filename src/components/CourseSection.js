import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';            // ← path verify कर लेना
import './CourseSection.css';
import GlobalEnrollModal from '../modal';

const CourseSection = () => {
  /* ───── taxonomy + courses state ───── */
  const [categories,    setCategories]    = useState([]);   // [{label,value}]
  const [subcategories, setSubcategories] = useState([]);   // [{label,parent}]
  const [courses,       setCourses]       = useState([]);
  const [activeCategory,setActiveCategory]= useState('');

  /* ───── enroll modal state ───── */
  const [showModal,      setShowModal]      = useState(false);
  const [formSubmitted,  setFormSubmitted]  = useState(false);
  const [formData,       setFormData]       = useState({
    firstName:'', middleName:'', lastName:'',
    phone:'', alternatePhone:'', email:'', address:'',
    courseName:''
  });

  /* ───── fetch categories & subcats once ───── */
  useEffect(() => {
    (async () => {
      const catSnap = await getDocs(collection(db,'categories'));
      const catArr  = catSnap.docs.map(d => d.data());   // {label,value}
      setCategories(catArr);
      if (catArr.length) setActiveCategory(catArr[0].value);

      const subSnap = await getDocs(collection(db,'subcategories'));
      setSubcategories(subSnap.docs.map(d => d.data())); // {label,parent}
    })();
  }, []);

  /* ───── live listener for top-6 courses in activeCategory ───── */
  useEffect(() => {
    if (!activeCategory) return;
    const q = query(
      collection(db,'courses'),
      where('categories','array-contains',activeCategory),
      limit(6)                                   // सिर्फ 6 दिखा रहे हैं
    );
    const unsub = onSnapshot(q,snap=>{
      setCourses(snap.docs.map(d=>({id:d.id,...d.data()})));
    });
    return unsub;
  }, [activeCategory]);

  /* ───── derive subcat filter (optional) ───── */
  const activeSubcats = subcategories
    .filter(s => (s.parent || s.category) === activeCategory)
    .map(s => s.label);

  const filteredCourses = activeSubcats.length
    ? courses.filter(c => {
        const subArr = Array.isArray(c.subcategories)
          ? c.subcategories
          : [c.subcategory || ''];
        return subArr.some(s => activeSubcats.includes(s));
      })
    : courses;

  /* ───── modal submit dummy ───── */
  const handleSubmit = e => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(()=>{
      setShowModal(false); setFormSubmitted(false);
      setFormData(prev=>({...prev,firstName:'',middleName:'',lastName:'',
        phone:'',alternatePhone:'',email:'',address:'',courseName:''}));
    },2000);
  };

  if (!categories.length)
    return <div className="loading-message">Loading courses…</div>;

  /* ───── JSX ───── */
  return (
    <>
      <section className="section-heading-centered">
        <div className="centered-heading">
          <h2>Why Upskilling is Key to Retaining Top Talent in 2025</h2>
        </div>
      </section>

      <section className="course-section">
        {/* category pills */}
        <div className="subcategories">
          {categories.map(cat=>(
            <div
              key={cat.value}
              className={`pill ${cat.value===activeCategory?'active':''}`}
              onClick={()=>setActiveCategory(cat.value)}
            >
              <strong>{cat.label}</strong>
            </div>
          ))}
        </div>

        {/* course cards */}
        <div className="course-cards">
          {filteredCourses.map(course=>(
            <div className="course-card" key={course.id}>
              <img src={course.thumbnailURL || '/placeholder.jpg'} alt={course.title}/>
              <div className="card-content">
                <h4 title={course.title}>{course.title}</h4>
                {course.instructors && <p title={course.instructors}>{course.instructors}</p>}

                <div className="rating-price">
                  <span>⭐ {course.rating || 4.5} (
                    {(course.reviews || 100).toLocaleString()})</span>
                </div>

                {course.tag && (
                  <span className={`tag ${course.tag.toLowerCase().replace(/\s+/g,'-')}`}>
                    {course.tag}
                  </span>
                )}

                <button
                  className="enroll-btn"
                  onClick={()=>{ setFormData(p=>({...p,courseName:course.title})); setShowModal(true); }}
                  style={{marginTop:'10px',width:'100%',padding:'10px'}}
                >Enroll Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <GlobalEnrollModal
        show={showModal}
        onClose={()=>setShowModal(false)}
        onSubmit={handleSubmit}
        onChange={e=>setFormData({...formData,[e.target.name]:e.target.value})}
        formData={formData}
        formSubmitted={formSubmitted}
      />
    </>
  );
};

export default CourseSection;
