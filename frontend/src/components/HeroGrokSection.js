import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import "./HeroGrokSection.css";

const slides = [
  {
    title: "Learnsy",
    subtitle: "AI-powered learning platform. Unlock skills. Earn NFT certificates.",
    bgClass: "slide-bg-1"
  },
  {
    title: "NFT Certificates",
    subtitle: "Blockchain-backed credentials you truly own — forever.",
    bgClass: "slide-bg-2"
  },
  {
    title: "Web3 Learning",
    subtitle: "Enroll with MetaMask. Learn, earn, and mint your success.",
    bgClass: "slide-bg-3"
  }
];

const HeroGrokSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`hero-section ${slides[current].bgClass}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">{slides[current].title}</h1>
          <p className="hero-subtitle">{slides[current].subtitle}</p>
          <div className="hero-buttons">
            <button className="btn-primary">Start Learning</button>
            <button className="btn-outline">Explore Courses</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default HeroGrokSection;
