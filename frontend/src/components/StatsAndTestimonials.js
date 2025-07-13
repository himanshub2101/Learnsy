import CountUp from "react-countup";
import Slider from "react-slick";
import { FaUsers, FaBook, FaChalkboardTeacher } from "react-icons/fa"; // Import icons
import "./StatsTestimonials.css";

export default function StatsAndTestimonials() {
  /* ----------- data ----------- */
  const stats = [
    { label: "Learners", value: 120_00, icon: <FaUsers />, progress: 75 },
    { label: "Courses", value: 10, icon: <FaBook />, progress: 50 },
    { label: "Instructors", value: 13, icon: <FaChalkboardTeacher />, progress: 60 },
  ];

  const reviews = [
    {
      name: "Aisha K.",
      job: "Frontend Dev @ Google",
      text:
        "The MERN stack course literally changed my career. Two months later I landed a dream job!",
      avatar: "https://i.pravatar.cc/100?img=32",
    },
    {
      name: "Rohan S.",
      job: "Marketing Lead @ Shopify",
      text:
        "Digital-marketing programme helped us scale ads 4× while cutting CPA in half. Incredible!",
      avatar: "https://i.pravatar.cc/100?img=15",
    },
    {
      name: "Lena W.",
      job: "Freelance Video Editor",
      text:
        "I started with zero editing knowledge. Now I bill $4k+/mo to international clients.",
      avatar: "https://i.pravatar.cc/100?img=47",
    },
    {
      name: "Carlos P.",
      job: "Blockchain Engineer @ Solana",
      text:
        "The Solidity bootcamp nailed the fundamentals and best practices. Highly recommended.",
      avatar: "https://i.pravatar.cc/100?img=60",
    },
    {
      name: "Meera D.",
      job: "UI/UX Designer @ Canva",
      text:
        "HTML/CSS course cleared so many small confusions I had. Loved the pace and clarity.",
      avatar: "https://i.pravatar.cc/100?img=22",
    },
  ];

  /* ----------- slider config ----------- */
  const reviewSettings = {
    dots: true,
    autoplay: true,
    arrows: false,
    adaptiveHeight: true,
    speed: 600,
  };

  /* ----------- markup ----------- */
  return (
    <section className="stats-testimonials">
      {/* ==== STATS ==== */}
      <h2 className="block-title">Why Learners ❤️ Learnsy</h2>
      <div className="stats">
        {stats.map((s) => (
          <div key={s.label} className="stat-box">
            <div className="stat-icon">{s.icon}</div>
            <span className="count">
              <CountUp end={s.value} duration={2} separator="," />
            </span>
            <span className="label">{s.label}</span>
            <div className="progress-circle" style={{ "--progress": `${s.progress}%` }}></div>
          </div>
        ))}
      </div>

      {/* ==== TESTIMONIALS ==== */}
      <h2 className="block-title">Success Stories</h2>
      <div className="testimonials">
        <Slider {...reviewSettings}>
          {reviews.map((r, i) => (
            <div className="review" key={i}>
              <p className="review-text">“{r.text}”</p>
              <div className="reviewer">
                <img src={r.avatar} alt={r.name} loading="lazy" />
                <div>
                  <strong>{r.name}</strong>
                  <span>{r.job}</span>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}