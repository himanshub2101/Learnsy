import React, { useState, useEffect } from 'react';
import './GoalSection.css';

const GoalSection = () => {
  const [goals, setGoals] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch('/json/goals.json')
      .then((res) => res.json())
      .then((data) => setGoals(data))
      .catch((err) => console.error('Failed to load goals:', err));
  }, []);

  const handleGoalClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="goal-section">
      <div className="goal-left">
        <h2>Learning focused on your goals</h2>
        {goals.map((goal, index) => (
          <div
            className={`goal-card ${index === activeIndex ? 'active' : ''}`}
            key={index}
            onClick={() => handleGoalClick(index)}
          >
            <div className="goal-icon">{goal.icon}</div>
            <div>
              <h4>{goal.title}</h4>
              <p>{goal.description}</p>
              {goal.badge && <span className="badge">{goal.badge}</span>}
              {goal.linkText && <a href="#" className="goal-link">{goal.linkText}</a>}
            </div>
          </div>
        ))}
      </div>
      <div className="goal-right">
        {goals[activeIndex] && (
          <img
            src={goals[activeIndex].image || '/desktop-certification-prep-2x.webp'}
            alt={goals[activeIndex].title}
          />
        )}
      </div>
    </section>
  );
};

export default GoalSection;
