// src/frontend/pages/AllCoursesPage.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import './AllCoursesPage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlobalEnrollModal from '../modal';

const AllCoursesPage = () => {
  const [categories,    setCategories]    = useState([]);   // [{label,value}]
  const [subcategories, setSubcategories] = useState([]);   // [{label,parent}]
  const [courses,       setCourses]       = useState([]);
  const [activeCategory,setActiveCategory]= useState('');   // ← value (e.g. 'development')

  const [showModal, setShowModal]   = useState(false);
  const [formSubmitted,setFormSubmitted]=useState(false);
  const [formData, setFormData]     = useState({
    firstName:'', middleName:'', lastName:'', phone:'',
    alternatePhone:'', email:'', address:'', courseName:''
  });

  /* ─── fetch taxonomy once ─── */
  useEffect(() => {
    (async () => {
      const catSnap = await getDocs(collection(db,'categories'));
      const catArr  = catSnap.docs.map(d => d.data());      // {label,value}
      setCategories(catArr);
      if (catArr.length) setActiveCategory(catArr[0].value);

      const subSnap = await getDocs(collection(db,'subcategories'));
      setSubcategories(subSnap.docs.map(d => d.data()));    // {label,parent}
    })();
  }, []);

  /* ─── live courses listener ─── */
  useEffect(() => {
    if (!activeCategory) return;
    const q = query(
      collection(db,'courses'),
      where('categories','array-contains',activeCategory)
    );
    const unsub = onSnapshot(q,snap=>{
      setCourses(snap.docs.map(d=>({id:d.id,...d.data()})));
    });
    return unsub;
  },[activeCategory]);

  /* ─── helpers ─── */
  const handleInputChange = e =>
    setFormData({...formData,[e.target.name]:e.target.value});

  const handleSubmit = e =>{
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(()=>{
      setShowModal(false); setFormSubmitted(false);
      setFormData(prev=>({...prev,courseName:'',firstName:'',middleName:'',lastName:'',
        phone:'',alternatePhone:'',email:'',address:''}));
    },2000);
  };

  /* ─── derive subcats & final filter ─── */
  const activeSubcats = subcategories
    .filter(s => (s.parent || s.category) === activeCategory)
    .map(s => s.label || s.name);

  const filteredCourses = activeSubcats.length
    ? courses.filter(c=>{
        const subArr = Array.isArray(c.subcategories)
          ? c.subcategories
          : [c.subcategory||''];
        return subArr.some(s=>activeSubcats.includes(s));
      })
    : courses;

  if (!categories.length) return <div className="loading-message">Loading courses…</div>;

  /* ─── JSX ─── */
  return (
    <>
      <Header/>

      <div className="course-page-container">
        <header className="page-header">
          <h1>All Courses</h1>
          <p>Explore our full range of online courses curated by experts</p>
        </header>

        <section className="course-section">
          <div className="subcategories scrollable">
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

          <h2 className="section-heading">📚 Courses in {categories.find(c=>c.value===activeCategory)?.label}</h2>

          <div className="course-cards">
            {filteredCourses.length ? filteredCourses.map(course=>(
              <div className="course-card" key={course.id}>
                <img src={course.thumbnailURL||course.image} alt={course.title}/>
                <div className="card-content">
                  <h4 title={course.title}>{course.title}</h4>
                  {course.instructors && <p title={course.instructors}>{course.instructors}</p>}
                  <div className="rating-price">
                    <span>⭐ {course.rating||4.5} ({(course.reviews||100).toLocaleString()})</span>
                  </div>
                  {course.tag && (
                    <span className={`tag ${course.tag.toLowerCase().replace(/\s+/g,'-')}`}>
                      {course.tag}
                    </span>
                  )}
                  <button
                    className="enroll-btn"
                    onClick={()=>{setFormData(p=>({...p,courseName:course.title})); setShowModal(true);}}
                    style={{marginTop:'10px',width:'100%',padding:'10px'}}
                  >Enroll Now</button>
                </div>
              </div>
            )): <p style={{marginTop:'1rem'}}>No courses found in this category yet.</p>}
          </div>
        </section>
      </div>

      <GlobalEnrollModal
        show={showModal}
        onClose={()=>setShowModal(false)}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        formData={formData}
        formSubmitted={formSubmitted}
      />

      <Footer/>
    </>
  );
};

export default AllCoursesPage;
