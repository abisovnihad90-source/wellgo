import React, { useState, useEffect } from "react";
import Slider from "../Slider/Slider";
import "./Home.css"

export default function Home() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCities() {
      try {
        const res1 = await fetch("https://683821582c55e01d184c0d9e.mockapi.io/api/cities/city");
        const res2 = await fetch("https://683a07db43bb370a8671a201.mockapi.io/api/cities/city");

        const data1 = await res1.json();
        const data2 = await res2.json();

        const combined = [...data1, ...data2];
        const shuffled = combined.sort(() => 0.5 - Math.random());

        setCities(shuffled.slice(0, 5));
      } catch (err) {
        console.error("Error fetching cities:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  if (loading) return <div>Loading cities...</div>;

  return (
    <div className="home-container">
      <Slider />

      <section className="explore">
        <hr />
        <h1>Discover Your Next Adventure</h1>
        <p>Plan, explore and share your journeys around the world with WellGo.</p>

        <h2>Popular Destinations</h2>
        <div className="destinations">
          {cities.map((city) => (
            <div key={city.id + city.name} className="destination-card">
              {city.image ? (
                <img src={city.image} alt={city.name} />
              ) : (
                <div className="no-image">No image</div>
              )}
              <h3>{city.name}</h3>
              <p>{city.country}</p>
            </div>
          ))}
        </div>
        <a href="/wellgo/explore/" className="btn">Start Exploring</a>
      </section>

      <section className="planner">
        <h2>Your Travel Assistant</h2>
        <p>Create personalized travel routes, plan your dates, and never miss a spot.</p>

        <div className="cards-container">
          <div className="card firstcard">
            <h3>Plan Your Dates</h3>
            <p>Select the perfect time frame for your trip and never miss a holiday!</p>
          </div>
          <div className="card secondcard">
            <h3>Create Custom Routes</h3>
            <p>Design your own travel path through cities and landmarks with ease.</p>
          </div>
          <div className="card thirdcard">
            <h3>Discover Must-See Spots</h3>
            <p>Get suggestions for top attractions, restaurants, and hidden gems.</p>
          </div>
        </div>
        <a href="/wellgo/planner/" className="btn-secondary">Plan Your Trip</a>
      </section>

      <section className="testimonials">
        <h2>What Our Travelers Say</h2>
        <div className="reviews">
          <div className="review-card">
            <p>"WellGo made planning my vacation so simple and fun!"</p>
            <h4>— John</h4>
          </div>
          <div className="review-card">
            <p>"I discovered places I would have never found without this app."</p>
            <h4>— Mark</h4>
          </div>
          <div className="review-card">
            <p>"A very user-friendly app that made my solo trip smooth and memorable."</p>
            <h4>— Harry</h4>
          </div>
          <div className="review-card">
            <p>"Booking and planning was effortless. The map integration is a game changer!"</p>
            <h4>— Drew</h4>
          </div>
          <div className="review-card">
            <p>"WellGo helped me find hidden gems in every city I visited. Highly recommended!"</p>
            <h4>— Kate</h4>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 WellGo. All rights reserved.</p>
        <nav>
          <a href="/wellgo/about/">About Us</a> | <a href="/wellgo/contact/">Contact</a> | <a href="/wellgo/privacy/">Privacy Policy</a>
        </nav>
      </footer>
    </div>
  );
}
