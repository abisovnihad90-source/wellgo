import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
// import AmadeusCitySearch from "../CityFlight/AmadeusCitySearch";
import "./CityGuide.css";
import StarRating from "../StarRating/StarRating";

export default function CityGuidePage() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [iataCode, setIataCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cityData = localStorage.getItem("cityDetails");
    if (cityData) {
      setSelectedCity(JSON.parse(cityData));
    } else {
      navigate("/wellgo/explore");
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedCity?.name) {
      fetch("https://683821582c55e01d184c0d9e.mockapi.io/api/cities/iata")
        .then((res) => res.json())
        .then((iataList) => {
          const matched = iataList.find(
            (item) => item.name.toLowerCase() === selectedCity.name.toLowerCase()
          );
          setIataCode(matched ? matched.iata : "");
        })
        .catch(() => setIataCode(""));
    }
  }, [selectedCity]);

  const handlePlan = (cityName) => {
    localStorage.setItem("selectedCity", cityName);
    navigate("/wellgo/planner");
  };

  const handleBack = () => {
    navigate("/wellgo/explore");
  };

  const loggedInUserString = localStorage.getItem("loggedInUser") || "";
  const loggedInUser = loggedInUserString ? JSON.parse(loggedInUserString) : null;

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    username: loggedInUser ? loggedInUser.username : "",
    review: "",
    rating: 0,
  });

  useEffect(() => {
    if (!selectedCity?.name) return;

    async function fetchReviews() {
      try {
        const res = await fetch(
          "https://683c245328a0b0f2fdc64af0.mockapi.io/api/review/review"
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          const cityReviews = data.filter(
            (review) =>
              review.cityId?.toLowerCase() === selectedCity.name.toLowerCase() ||
              review.name?.toLowerCase() === selectedCity.name.toLowerCase()
          );
          setReviews(cityReviews);
        } else {
          setReviews([]);
          console.warn("Unexpected review data format", data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        setReviews([]);
      }
    }

    fetchReviews();
  }, [selectedCity]);

  const handleSubmitReview = async () => {
    if (!newReview.username || !newReview.review || newReview.rating < 1) {
      alert("Zəhmət olmasa bütün sahələri doldurun və reytinq verin.");
      return;
    }

    const reviewToPost = {
      username: newReview.username,
      review: newReview.review,
      rate: newReview.rating,
      name: selectedCity.name, // Sənin sistemdə 'name' olaraq saxlanır
      date: format(new Date(), "dd MMM yyyy, HH:mm"),
    };

    try {
      const res = await fetch(
        "https://683c245328a0b0f2fdc64af0.mockapi.io/api/review/review",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewToPost),
        }
      );

      if (!res.ok) throw new Error("Failed to post review");

      const savedReview = await res.json();

      setReviews((prev) => [...prev, savedReview]);
      setNewReview({
        username: loggedInUser?.username || "",
        review: "",
        rating: 0,
      });
    } catch (error) {
      alert("Rəy əlavə edilərkən xəta baş verdi. Yenidən cəhd edin.");
      console.error(error);
    }
  };

  if (!selectedCity) return <p>Loading city details...</p>;

  return (
    <div className="city-guide-page">
      <h1>{selectedCity.name} Guide</h1>

      <div className="city-guide-main">
        <div className="city-image">
          {selectedCity.image ? (
            <img src={selectedCity.image} alt={selectedCity.name} />
          ) : (
            <div className="no-image">No image</div>
          )}
        </div>

        <div className="city-info">
          <table>
            <tbody>
              <tr>
                <th>Name:</th>
                <td>{selectedCity.name}</td>
              </tr>
              <tr>
                <th>Country:</th>
                <td>{selectedCity.country || "N/A"}</td>
              </tr>
              <tr>
                <th>Continent:</th>
                <td>{selectedCity.continent || "N/A"}</td>
              </tr>
              <tr>
                <th>Population:</th>
                <td>{selectedCity.population || "N/A"}</td>
              </tr>
              <tr>
                <th>Language:</th>
                <td>{selectedCity.language || "N/A"}</td>
              </tr>
              <tr>
                <th>Currency:</th>
                <td>{selectedCity.currency || "N/A"}</td>
              </tr>
              <tr>
                <th>Climate:</th>
                <td>{selectedCity.climate?.type || "N/A"}</td>
              </tr>
              <tr>
                <th>Max temperature:</th>
                <td>{selectedCity.climate?.averageSummerTempC ?? "N/A"} °C</td>
              </tr>
              <tr>
                <th>Min temperature:</th>
                <td>{selectedCity.climate?.averageWinterTempC ?? "N/A"} °C</td>
              </tr>
            </tbody>
          </table>
          <div className="guide-buttons">
            <button
              className="plan-button"
              onClick={() => handlePlan(selectedCity.name)}
            >
              Plan a trip
            </button>
            <button className="back-button" onClick={handleBack}>
              ← Back to Explore
            </button>
          </div>
        </div>
      </div>

      <div className="city-short-history">
        <h2>Short History</h2>
        <p>
          {selectedCity.shortHistory}{" "}
          <a
            href={selectedCity.more}
            className="learn-more"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read more
          </a>
        </p>
      </div>

      <div className="city-sights">
        <h2>Interesting Places</h2>
        <div className="city-sights-main">
          {selectedCity.sights && selectedCity.sights.length > 0 ? (
            selectedCity.sights.map((sight, index) => (
              <div className="sight-card" key={index}>
                {sight.images && sight.images.length > 0 ? (
                  <img src={sight.images[0]} alt={sight.name} />
                ) : (
                  <div className="no-image">No image</div>
                )}
                <h3>{sight.name}</h3>
                <p>{sight.description}</p>
                <a href={sight.more} target="_blank" rel="noopener noreferrer">
                  Learn more
                </a>
              </div>
            ))
          ) : (
            <p>No interesting places available.</p>
          )}
        </div>
      </div>

      {/* <div className="flight-search-section">
        <h2>Find Flights to {selectedCity.name}</h2>
        <AmadeusCitySearch
          destinationCityCode={iataCode}
          destinationCityName={selectedCity.name}
        />
      </div> */}


      <div className="city-review-section">
        <h2>Community Reviews</h2>

        {loggedInUser ? (
          <div className="review-input">
            <div className="rateusername">
              <input
                type="text"
                placeholder="Your name"
                value={newReview.username}
                readOnly
              />
              <StarRating
                rating={newReview.rating}
                setRating={(rate) => setNewReview({ ...newReview, rating: rate })}
              />
            </div>
            <textarea
              placeholder="Share your experience..."
              value={newReview.review}
              onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
            />
            <button onClick={handleSubmitReview}>Post Review</button>
          </div>
        ) : (
          <p>Please log in to post a review.</p>
        )}

        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="review-itemcity" key={review.id}>
                <div className="review-header">
                  <p>
                    {typeof review.username === "string"
                      ? review.username
                      : review.username.username}
                      <span className="review-ratings">{Array(review.rate).fill("⭐").join("")}</span> <span>{review.date}</span>
                  </p>
                </div>

                <div className="review-info">{review.review}</div>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to write one!</p>
          )}
        </div>
      </div>
    </div>
  );
}
