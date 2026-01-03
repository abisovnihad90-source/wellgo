import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Reviews.css";

const Review = ({ cityId }) => {
  const [reviews, setReviews] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewData, cityData1, cityData2] = await Promise.all([
          fetch("https://683c245328a0b0f2fdc64af0.mockapi.io/api/review/review").then(res => res.json()),
          fetch("https://683821582c55e01d184c0d9e.mockapi.io/api/cities/city").then(res => res.json()),
          fetch("https://683a07db43bb370a8671a201.mockapi.io/api/cities/city").then(res => res.json()),
        ]);

        // Şəhərləri birləşdir və unikal saxla
        const mergedCities = [...cityData1, ...cityData2];
        setCities(mergedCities);
        setReviews(reviewData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Şəhəri tap: ya id uyğunluğuna görə, ya da ad uyğunluğuna görə
  const getCity = (cityIdOrName) => {
    const foundById = cities.find(c => String(c.id) === String(cityIdOrName));
    if (foundById) return foundById;
    const foundByName = cities.find(c => c.name?.toLowerCase() === cityIdOrName?.toLowerCase());
    if (foundByName) return foundByName;
    return null;
  };


  const getCityImage = (city) => {
    if (!city) return null;

    if (Array.isArray(city.image) && city.image.length > 0) return city.image[0];
    if (typeof city.image === 'string') return city.image;
    if (city.imageUrl && typeof city.imageUrl === 'string') return city.imageUrl;
    if (Array.isArray(city.images) && city.images.length > 0) return city.images[0];

    return null;
  };




  const handleMoreClick = (city) => {
    if (!city) return;
    localStorage.setItem("cityDetails", JSON.stringify(city));
    navigate(`/wellgo/cityguide/${city.name}`);
  };

  const handlePlanClick = (cityName) => {
    localStorage.setItem("selectedCity", cityName);
    navigate("/wellgo/planner/");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="review-wrapper">
      <h2>Reviews</h2>
      <div className="review-list">
        {reviews.length === 0 && <p>No reviews found.</p>}
        {reviews.slice(0, visibleCount).map(({ id, name, username, rate, review }) => {
          const city = getCity(name);
          const cityName = city?.name || name;
          const image = getCityImage(city);

          return (
            <div key={id} className="review-item">
              <div className="review-imagediv">
                {image ? (
                  <img src={image} alt={cityName} className="review-image" />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>

              <div className="review-text">
                <h2>{cityName}</h2>
                <h4>Rate: {rate}⭐</h4>
                <p>
                  <b>{username}</b>: {review}
                </p>

                <div className="review-buttons">
                  <button onClick={() => handlePlanClick(cityName)} className="planrev-btn">
                    Plan
                  </button>
                  <button onClick={() => handleMoreClick(city)} className="morerev-btn">
                    More
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visibleCount < reviews.length && (
        <button className="load-more-btn" onClick={() => setVisibleCount(prev => prev + 5)}>
          Load More
        </button>
      )}
    </div>
  );
};

export default Review;
