// src/components/CourseSection.js
import React, { useEffect, useState } from "react";
import "./CourseSection.css";
import api from "../api/axios";
import GlobalEnrollModal from "../modal";

const CourseSection = () => {
  /* ───── state ───── */
  const [categories, setCategories] = useState([]);        // [{id,name,slug}]
  const [subcats,     setSubcats]   = useState([]);        // [{id,name}]
  const [courses,     setCourses]   = useState([]);
  const [activeCat,   setActiveCat] = useState("");

  /* ───── enroll modal ───── */
  const [showModal,     setShowModal]     = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData,      setFormData]      = useState({
    firstName: "", middleName: "", lastName: "",
    phone: "", alternatePhone: "", email: "", address: "",
    courseName: "",
  });

  /* ───── fetch all categories once ───── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
        if (data.length) setActiveCat(data[0].id);         // default first
      } catch (err) {
        console.error("Cannot load categories", err);
      }
    })();
  }, []);

  /* ───── when activeCat changes: fetch subcats & top‑6 courses ───── */
  useEffect(() => {
    if (!activeCat) return;

    // sub‑categories
    (async () => {
      try {
        const { data } = await api.get("/subcategories", {
          params: { category_id: activeCat },
        });
        setSubcats(data);
      } catch (err) {
        console.error("Cannot load subcategories", err);
        setSubcats([]);
      }
    })();

    // courses (limit 6)
    (async () => {
      try {
        const { data } = await api.get("/courses", {
          params: { category_id: activeCat, limit: 6 },
        });
        setCourses(data);
      } catch (err) {
        console.error("Cannot load courses", err);
        setCourses([]);
      }
    })();
  }, [activeCat]);

  /* ───── derive optional subcat filter list ───── */
  const activeSubcatNames = subcats.map((s) => s.name);

  const finalCourses = activeSubcatNames.length
    ? courses.filter((c) =>
        (c.subcategory?.name ? [c.subcategory.name] : []).some((n) =>
          activeSubcatNames.includes(n)
        )
      )
    : courses;

  /* ───── enroll modal helpers ───── */
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setShowModal(false);
      setFormData((p) => ({ ...p, courseName: "" }));
    }, 2000);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ───── loading state ───── */
  if (!categories.length)
    return <div className="loading-message">Loading courses…</div>;

  /* ───── JSX ───── */
  return (
    <>
      <section className="section-heading-centered">
        <div className="centered-heading">
          <h2>Why Upskilling is Key to Retaining Top Talent in 2025</h2>
        </div>
      </section>

      <section className="course-section">
        {/* category pills */}
        <div className="subcategories">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`pill ${cat.id === activeCat ? "active" : ""}`}
              onClick={() => setActiveCat(cat.id)}
            >
              <strong>{cat.name}</strong>
            </div>
          ))}
        </div>

        {/* course cards */}
        <div className="course-cards">
          {finalCourses.length ? (
            finalCourses.map((c) => (
              <div className="course-card" key={c.id}>
                <img src={c.thumbnail_url || "/placeholder.jpg"} alt={c.title} />
                <div className="card-content">
                  <h4 title={c.title}>{c.title}</h4>
                  <p>{(c.description_md || "").slice(0, 80)}…</p>

                  <div className="rating-price">
                    <span>💵 ${c.price_usd?.toFixed(2) || "0.00"}</span>
                  </div>

                  <button
                    className="enroll-btn"
                    onClick={() => {
                      setFormData((p) => ({ ...p, courseName: c.title }));
                      setShowModal(true);
                    }}
                    style={{ marginTop: "10px", width: "100%", padding: "10px" }}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ marginTop: "1rem" }}>No courses found in this category.</p>
          )}
        </div>
      </section>

      {/* global modal */}
      <GlobalEnrollModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        onChange={handleChange}
        formData={formData}
        formSubmitted={formSubmitted}
      />
    </>
  );
};

export default CourseSection;
