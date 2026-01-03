import React, { useState, useEffect } from "react";
import "./Slider.css"; // CSS-i import edirik

const slidesData = [
  {
    title: "Plan your trip with us!",
    description: "The best countries, tourist spots, and weather forecast all in one place.",
    imageUrl: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Discover your favorite places",
    description: "Add the places you want to visit to your list and share your impressions.",
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "See your trip on the map",
    description: "Mark the places you've been on the map and visualize your plans.",
    imageUrl: "https://plus.unsplash.com/premium_photo-1673697239981-389164b7b87f?q=80&w=2044&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];


export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slidesData.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slidesData.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slidesData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="slider"
      style={{
        backgroundColor: slidesData[currentIndex].bgColor, backgroundImage: `url(${slidesData[currentIndex].imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="overlay">
        <h2 className="slider-title">{slidesData[currentIndex].title}</h2>
      <p className="slider-description">{slidesData[currentIndex].description}</p>
      </div>

      <button className="slider-btn prev" onClick={goToPrev} aria-label="Previous Slide">
        ‹
      </button>
      <button className="slider-btn next" onClick={goToNext} aria-label="Next Slide">
        ›
      </button>

      <div className="dots">
        {slidesData.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
