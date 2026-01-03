import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../image/avatar.png";

export default function Profile({ loggedInUser, onLogout }) {
  if (!loggedInUser) {
  return <div style={{ padding: "2rem", fontSize: "1.2rem" }}>Zəhmət olmasa profilə baxmaq üçün daxil olun.</div>;
}
  const navigate = useNavigate();

  const [favoriteCities, setFavoriteCities] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [tripPlans, setTripPlans] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(loggedInUser || {});

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/wellgo/login");
      return;
    }

    // Favorit və planlar localStorage-dan
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavoriteCities(favs);

    const plans = JSON.parse(localStorage.getItem("tripPlans")) || [];
    setTripPlans(plans);

    // İki API-dən şəhər şəkillərini yüklə və birləşdir
    Promise.all([
      fetch("https://683821582c55e01d184c0d9e.mockapi.io/api/cities/city").then((res) => res.json()),
      fetch("https://683a07db43bb370a8671a201.mockapi.io/api/cities/city").then((res) => res.json())
    ])
      .then(([data1, data2]) => {
        const merged = [...data1, ...data2];
        setCitiesData(merged);
      })
      .catch((err) => console.error("Şəhərlər yüklənmədi:", err));

    // Review-lar
    fetch("https://683c245328a0b0f2fdc64af0.mockapi.io/api/review/review")
      .then((res) => res.json())
      .then((data) => {
        const userOnly = data.filter(
          (review) => review.username === loggedInUser.username
        );
        setUserReviews(userOnly);
      })
      .catch((err) => console.error("Reviewlar yüklənmədi:", err));

    setEditedUser(loggedInUser);
  }, [loggedInUser, navigate]);

  const handleLogout = () => {
    onLogout();
    navigate("/wellgo/login");
  };

  const handleEditChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("loggedInUser", JSON.stringify(editedUser));
    window.location.reload();
  };

  const getCityImage = (cityName) => {
    const city = citiesData.find((c) => c.name === cityName);
    return city ? city.image : null;
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={defaultAvatar} alt="Profile" className="profile-avatar" />
        <div>
          {editing ? (
            <>
              <div className="profile-header-input">
                <input
                  type="text"
                  name="username"
                  value={editedUser.username}
                  onChange={handleEditChange}
                />
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleEditChange}
                />
              </div>
              <button className="btn save-bttn" onClick={handleSave}>
                Save
              </button>
              <button className="btn cancel-bttn" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <h2>Welcome, {loggedInUser.username}!</h2>
              <p>Email: {loggedInUser.email}</p>
              <button className="btn edit-bttn" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
              <button className="btn logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      <div className="stats-boxes">
        <div className="stat-card">
          <h3>{userReviews.length}</h3>
          <p>Reviews</p>
        </div>
        <div className="stat-card">
          <h3>{favoriteCities.length}</h3>
          <p>Favorite Cities</p>
        </div>
        <div className="stat-card">
          <h3>{tripPlans.length}</h3>
          <p>Trip Plans</p>
        </div>
      </div>

      <div className="favorites-section">
        <h3>⭐ Favorite Cities</h3>
        <div className="card-favgrid">
          {favoriteCities.length > 0 ? (
            favoriteCities.map((city, index) => (
              <div key={index} className="fav-card">
                <p>{city}</p>
              </div>
            ))
          ) : (
            <p>No favorites yet.</p>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h3>📝 Your Reviews</h3>
        <div className="card-reviewgrid">
          {userReviews.length > 0 ? (
            userReviews.map((review, index) => (
              <div key={index} className="review-cardd">
                <p className="reviews-name">{review.name}</p>
                <h5 className="reviews-username">{review.username}  <span> {review.rate} ⭐</span></h5>
                <p className="review-infos">{review.review}</p>
               
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>

      <div className="planner-section">
        <h3>🗺️ Your Trip Plans</h3>
        <div className="card-grid">
          {tripPlans.length > 0 ? (
            tripPlans.map((plan, index) => {
              const imgSrc = getCityImage(plan.name);
              return (
                <div key={index} className="plan-card">
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt={plan.name}
                      className="plan-city-image"
                    />
                  )}
                  <div>
                    <h4>{plan.name}</h4>
                    <p>{plan.note || "No note"}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No trip plans yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
