// src/pages/Home.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

import "./Home.css";
import TrendingCourses from "../components/TrendingCourses";
import FeatureCards from "../components/FeaturesCards";
import Header from "../components/Header";
import CourseSection from "../components/CourseSection";
import GoalSection from "../components/GoalSection";
import Footer from "../components/Footer";

import api from "../api/axios";               // ✅ central axios instance
import StatsAndTestimonials from "../components/StatsAndTestimonials";
import HeroGrokSection from "../components/HeroGrokSection";

const Home = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [sending, setSending] = useState(false);

  /* ───────────────────── slider config ───────────────────── */
const sliderSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  speed: 800,
  autoplaySpeed: 4000,
  slidesToShow: 1,
  slidesToScroll: 1,
  fade: true, // Add this
};


  /* ───────────────────── fetch 3 featured courses ───────────────────── */
  useEffect(() => {
    (async () => {
      try {
        // grab first 3 published courses (add ?limit=3 in BE if you like)
        const { data } = await api.get("/courses", { params: { limit: 3 } });
        const formatted = data.map((c) => ({
          id: c.id,
          title: c.title,
          description:
            (c.description_md || "").replace(/[#*_`-]/g, "").slice(0, 100) +
            (c.description_md?.length > 100 ? "…" : ""),
          image: c.thumbnail_url || "/placeholder.jpg",
          cta: "View Course",
        }));
        setSlides(formatted);
      } catch (err) {
        console.error("Failed to load slides:", err);
        // fall back to hard‑coded banners (optional)
setSlides([
  {
    title: "Master Digital Marketing",
    description:
      "Learn SEO, social media, email marketing and grow your business online.",
    image: "/banners/digital‑marketing.jpg",
    cta: "Start Learning",
  },
  {
    title: "JavaScript Development",
    description:
      "From ES6 to async/await – build dynamic, modern web apps with JS.",
    image: "/banners/javascript‑dev.jpg",
    cta: "Start Coding",
  },
  {
    title: "HTML & CSS Fundamentals",
    description:
      "Craft beautiful, responsive webpages with semantic HTML and modern CSS.",
    image: "/banners/html‑css.jpg",
    cta: "Build Websites",
  },
  {
    title: "Full‑Stack Web Development",
    description:
      "Front‑end, back‑end, databases & deployment – the complete bootcamp.",
    image: "/banners/web‑dev‑bootcamp.jpg",
    cta: "Join Bootcamp",
  },
  {
    title: "Blockchain Development",
    description:
      "Dive into smart contracts, Solidity, and decentralised apps (dApps).",
    image: "/banners/blockchain.jpg",
    cta: "Explore Web3",
  },
  {
    title: "Video Editing Mastery",
    description:
      "Produce cinematic videos with Premiere Pro, DaVinci Resolve & more.",
    image: "/banners/video‑editing.jpg",
    cta: "Edit Like a Pro",
  },
  {
    title: "Google Ads Mastery",
    description:
      "Plan, launch and optimise PPC campaigns that convert and scale.",
    image: "/banners/google‑ads.jpg",
    cta: "Launch Campaign",
  },
  {
    title: "Meta Ads Mastery",
    description:
      "Dominate Facebook & Instagram ads with targeting and creative hacks.",
    image: "/banners/meta‑ads.jpg",
    cta: "Boost Reach",
  },
  {
    title: "MERN Stack Development",
    description:
      "MongoDB, Express, React, Node – build and deploy scalable apps.",
    image: "/banners/mern‑stack.jpg",
    cta: "Build MERN App",
  },
  {
    title: "Mobile App Development",
    description:
      "Create native & cross‑platform apps with Flutter and React Native.",
    image: "/banners/app‑dev.jpg",
    cta: "Go Mobile",
  },
]);

      }
    })();
  }, []);

  /* ───────────────────── contact‑form submit ───────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());

    try {
      setSending(true);
      await api.post("/contact", formData);      // or /enquiries – up to you
      alert("Message sent – we'll get back to you soon!");
      e.target.reset();
    } catch (err) {
      console.error("Contact send failed", err);
      alert("Oops, could not send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  /* ───────────────────── JSX ───────────────────── */
  return (
    <>
      <Header />

      {/* Hero carousel + contact form */}
      {/* <section className="hero-contact">
        <div className="hero-left">
          {slides.length ? (
            <Slider {...sliderSettings}>
              {slides.map((s, i) => (
                <div className="hero-slide" key={i}>
                  <img src={s.image} alt={s.title} />
                  <div className="slide-content">
                    <h1>{s.title}</h1>
                    <p>{s.description}</p>
                    {s.id ? (
                      <button
                        className="cta-btn"
                        onClick={() => navigate(`/courses/${s.id}`)}
                      >
                        {s.cta}
                      </button>
                    ) : (
                      <button className="cta-btn">{s.cta}</button>
                    )}
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p style={{ padding: "2rem" }}>Loading featured courses…</p>
          )}
        </div>

        <div className="hero-right">
          <h2>Get in Touch</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input name="name" type="text" placeholder="Your Name" required />
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              required
            ></textarea>
            <button type="submit" disabled={sending}>
              {sending ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </section> */}
        <HeroGrokSection />
      {/* other home‑page blocks */}
      <TrendingCourses />
      <div className="explore-btn-container">
        <button className="explore-more-btn" onClick={() => navigate("/courses")}>
          Explore More Courses
        </button>
      </div>
      <FeatureCards />
      <CourseSection />
      <GoalSection />
      <StatsAndTestimonials />
      <Footer />
    </>
  );
};

export default Home;
