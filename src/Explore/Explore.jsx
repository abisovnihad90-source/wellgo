import React, { useState, useEffect } from "react";
import "./Explore.css";
import { useNavigate } from "react-router-dom";

export default function ExplorePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function fetchCities() {
      setLoading(true);
      try {
        // İki API-dən fetch
        const res2 = await fetch("https://683a07db43bb370a8671a201.mockapi.io/api/cities/city");
        const data2 = await res2.json();

        const res1 = await fetch("https://683821582c55e01d184c0d9e.mockapi.io/api/cities/city");
        const data1 = await res1.json();

        // İki arrayi birləşdiririk
        const combinedData = [...data1, ...data2];

        // Axtarışa görə filter
        const filtered = combinedData.filter(city =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setDestinations(filtered);
      } catch (err) {
        console.error("Error loading cities:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, [searchTerm]);

  const toggleFavorite = (name) => {
  setFavorites((prev) => {
    const updated = prev.includes(name)
      ? prev.filter((f) => f !== name)
      : [...prev, name];

    localStorage.setItem("favorites", JSON.stringify(updated));
    return updated;
  });
};


  const handleMore = (cityData) => {
    localStorage.setItem("cityDetails", JSON.stringify(cityData));
    navigate(`/wellgo/cityguide/${cityData.name}`);
  };

  const handlePlan = (cityName) => {
    localStorage.setItem("selectedCity", cityName);
    navigate("/wellgo/planner/");
  };

  useEffect(() => {
  const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
  setFavorites(storedFavorites);
}, []);


  return (
    <div className="explore-page">
      <h1>Explore Destinations</h1>

<div className="search-wrapper">
  <input
    type="text"
    placeholder="Search by city..."
    className="searchexplore-bar"
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setVisibleCount(10);
    }}
  />
</div>

      {loading ? (
        <p>Loading destinations...</p>
      ) : (
        <>
          <div className="destination-grid">
            {destinations.slice(0, visibleCount).map((dest, idx) => (
              <div className="destination-card" key={idx}>
                {dest.image ? (
                  <img src={dest.image} alt={dest.name} />
                ) : (
                  <div
                    style={{
                      width: "200px",
                      height: "150px",
                      backgroundColor: "#ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    No image
                  </div>
                )}
                <div className="card-content">
                  <h3>{dest.name}</h3>
                  {dest.country && <p>{dest.country}</p>}
                  {dest.description && <p className="desc">{dest.description}</p>}
                  <button
                    className={`fav-btn ${favorites.includes(dest.name) ? "active" : ""}`}
                    onClick={() => toggleFavorite(dest.name)}
                  >
                    {favorites.includes(dest.name) ? "★" : "☆"}
                  </button>
                  <div className="card-buttons">
                    <button className="more-btn" onClick={() => handleMore(dest)}>
                      More
                    </button>
                    <button className="plan-btn" onClick={() => handlePlan(dest.name)}>
                      Plan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
 {visibleCount < destinations.length && (
    <div className="more-wrapper">
      <button
        className="more-button"
        onClick={() => setVisibleCount((prev) => prev + 20)}
      >
        More
      </button>
    </div>

          )}
        </>
      )}
    </div>
  );
}
