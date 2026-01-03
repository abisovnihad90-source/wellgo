import React, { useEffect, useState } from 'react';
import './TravelNews.css';

const NEWS_API_KEY = '3d352be150b44bffa182ef7f721ced1a';
const CITIES_API = 'https://683821582c55e01d184c0d9e.mockapi.io/api/cities/city';

const TravelNews = () => {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Baku');
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(CITIES_API)
      .then(res => res.json())
      .then(data => {
        setCities(data);
        setFilteredCities(data);
      })
      .catch(err => console.error('Failed to fetch cities:', err));
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCities(cities);
    } else {
      setFilteredCities(
        cities.filter(city =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, cities]);

  useEffect(() => {
    if (!selectedCity) return;

    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(selectedCity)}&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`
        );
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [selectedCity]);

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setSearchTerm('');
  };

  return (
    <div className="news-container-wrapper" style={{ maxWidth: '800px', margin: '100px auto' }}>
      <h1>News about Cities</h1>

      <div className='city-search-wrapper'>
        <input
        type="text"
        placeholder="Search city..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="city-search-input"
      />
      </div>

      {searchTerm !== '' && (
        <div className="city-search-results">
          {filteredCities.length > 0 ? (
            filteredCities.map(city => (
              <div
                key={city.id}
                onClick={() => handleCitySelect(city.name)}
                className={`city-item ${selectedCity === city.name ? 'selected' : ''}`}
              >
                {city.name}
              </div>
            ))
          ) : (
            <p className="no-cities">No cities found.</p>
          )}
        </div>
      )}


      <div className="news-container">
        {articles.length === 0 && selectedCity && <p>No news found for this city.</p>}

        {articles.map((article, index) => {
          const {
            title,
            urlToImage,
            description,
            url,
          } = article;

          return (
            <div key={index} className="news-card">
              <div className="news-main">
                <img src={urlToImage || 'https://via.placeholder.com/300x180'} alt="news" />
                <div className="news-summary">
                  <h2>{title}</h2>
                  <p>{description ? description : 'No description available.'}</p>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="read-link">
                    Read full article
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TravelNews;
