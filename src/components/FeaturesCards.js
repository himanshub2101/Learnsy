import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturesCards.css';

const FeatureCards = () => {
  const features = [
    { icon: '⭐', title: 'Resume Building', description: 'Craft a professional resume that stands out to recruiters.' },
    { icon: '🧪', title: 'Monthly Mock Tests', description: 'Practice with real-world scenarios to boost confidence.' },
    { icon: '🎯', title: 'Final Assessment Test', description: 'Prove your skills with a comprehensive evaluation.' },
    { icon: '🧠', title: 'Psychometric Test', description: 'Analyze your career strengths to find the perfect path.' },
    { icon: '🗣', title: 'HR Round & Interview Prep', description: 'Ace interviews with expert guidance and mock sessions.' },
    { icon: '📁', title: 'In-House Project Work', description: 'Build real projects to showcase your skills.' },
    { icon: '📄', title: 'Course-wise Assignments', description: 'Learn through practical tasks with expert doubt-solving.' },
    { icon: '🎓', title: 'Certificate & Portfolio', description: 'Earn credentials and build a standout portfolio.' }
  ];

  return (
    <section className="features-section">
      <h2>Education Tailored to Your Ambitions</h2>
      <p>
        Unlock your potential with personalized online courses designed to match your ambitions, 
        whether you're mastering digital marketing, becoming a web developer, 
        or exploring cutting-edge fields like AI and data science.
      </p>
      <div className="features-container">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <Link to="/courses" className="feature-cta">Learn More</Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;