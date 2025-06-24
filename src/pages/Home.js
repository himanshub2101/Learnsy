import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import './Home.css';
import TrendingCourses from '../components/TrendingCourses';
import FeatureCards from "../components/FeaturesCards";
import Header from '../components/Header';
import CourseSection from '../components/CourseSection';
import GoalSection from '../components/GoalSection';
import Footer from '../components/Footer';

const Home = () => {
  const [slides, setSlides] = useState([]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    // Simulated fetch – replace with actual API call or JSON import if needed
    const fetchSlides = async () => {
      try {
        const res = await fetch('/json/slides.json');
        const data = await res.json();
        setSlides(data);
      } catch (err) {
        console.error("Failed to load slides:", err);
        // Fallback static slides
        setSlides([
          {
            title: "Master Digital Marketing",
            description: "Learn SEO, social media, email marketing, and grow your business online.",
            image: "../../public/DigitalMarketingBanner.jpg",
            cta: "Start Learning"
          },
          {
            title: "Become a Web Developer",
            description: "Learn HTML, CSS, JavaScript, and frameworks like React.",
            image: "../../public/WebDevelopment.png",
            cta: "Explore Courses"
          },
          {
            title: "Become a Pro Video Editor",
            description: "Learn Learn Adobe Premier Pro, Blender, Canva, and all.",
            image: "../../public/VideoEditingBanner.webp",
            cta: "Explore Courses"
          }
        ]);
      }
    };

    fetchSlides();
  }, []);

  return (
    <>
      <Header />
      {/* Hero with carousel left + contact form right */}
      <section className="hero-contact">
        <div className="hero-left">
          <Slider {...sliderSettings}>
            {slides.map((slide, index) => (
              <div className="hero-slide" key={index}>
                <img src={slide.image} alt={slide.title} />
                <div className="slide-content">
                  <h1>{slide.title}</h1>
                  <p>{slide.description}</p>
                  <button className="cta-btn">{slide.cta}</button>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <div className="hero-right">
          <h2>Get in Touch</h2>
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="4" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>

      {/* Trending Courses */}
      <TrendingCourses />

      {/* Explore More Button */}
      <div className="explore-btn-container">
        <button className="explore-more-btn">Explore More Courses</button>
      </div>

      {/* Features Card */}
      <FeatureCards />

      {/* Courses Section */}
      <CourseSection />

      {/* Goals Section */}
      <GoalSection />


      <Footer/>
    </>
  );
};

export default Home;
