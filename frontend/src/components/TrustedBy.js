import React from "react";
import "./TrustedBy.css";

const logos = [
  { src: "/google.png", alt: "Google" },
  { src: "/meta.png", alt: "Meta" },
  { src: "/social.png", alt: "Amazon" },
  { src: "/tesla.png", alt: "Tesla" },
  { src: "/tata-logo-1.svg", alt: "TCS" },
  { src: "/spotify.png", alt: "Spotify" },
];

const TrustedBy = () => {
  return (
    <section className="trustedby-section">
      <h3 className="trustedby-heading">Trusted by teams at</h3>
      <div className="trustedby-logos">
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo.src}
            alt={logo.alt}
            style={{ animationDelay: `${index * 0.15}s` }}
            className="logo-fade"
          />
        ))}
      </div>
    </section>
  );
};

export default TrustedBy;