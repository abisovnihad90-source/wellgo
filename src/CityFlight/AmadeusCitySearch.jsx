import React, { useState, useEffect } from "react";
import "./AmadeusCitySearch.css";

const AmadeusCitySearch = ({ destinationCityCode, destinationCityName }) => {
  const originCode = "GYD"; // Bakı hava limanı kodu
  const destinationCode = destinationCityCode;

  const client_id = "2gZtGL1vGFnomuxPXgehoJygxHae4qQG";
  const client_secret = "6NTHRCGTMRRRAg7G";

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // Access token alma funksiyası
  const getAccessToken = async () => {
    const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id,
        client_secret,
      }),
    });
    if (!res.ok) throw new Error("Access token almaq mümkün olmadı");
    const data = await res.json();
    return data.access_token;
  };

  // Uçuşları alma funksiyası
  const fetchFlightOffers = async (token, origin, destination, date) => {
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=1&max=9`;

    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Flight offers almaq mümkün olmadı");
    const data = await res.json();
    return data.data || [];
  };

  const handleSearch = async () => {
    if (!destinationCode) {
      setError("Təyinat şəhərinin kodu yoxdur");
      return;
    }

    setLoading(true);
    setError(null);
    setFlights([]);

    try {
      const token = await getAccessToken();
      const offers = await fetchFlightOffers(token, originCode, destinationCode, selectedDate);
      setFlights(offers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (destinationCode) {
      handleSearch();
    }
  }, [destinationCode, selectedDate]);

  return (
    <div className="amadeus-flight-search">
      <div className="inputs">
        <div>
          <label>Origin:</label>
          <input type="text" value={originCode} readOnly />
        </div>
        <div>
          <label>Destination:</label>
          <input
            type="text"
            value={destinationCode || ""}
            placeholder="Təyinat şəhər kodu"
            readOnly
          />
        </div>
        <div>
          <label>Departure Date:</label>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <button onClick={handleSearch} disabled={loading || !destinationCode}>
          Search Flights
        </button>
      </div>

      {loading && <p>Loading flight offers...</p>}
      {error && <p className="error">{error}</p>}

      <div className="flight-results">
        {flights.length > 0 ? (
          flights.map((flight, idx) => {
            const segment = flight.itineraries[0].segments[0];
            const carrierCode = segment.carrierCode;
            const logoUrl = `https://content.airhex.com/content/logos/airlines_${carrierCode}_200_200_s.png`;

            return (
              <div key={idx} className="flight-offer">
                <img
                  className="logo"
                  src={logoUrl}
                  alt={`${carrierCode} logo`}
                  onError={(e) => (e.target.style.display = "none")}
                />
                <p>
                  <strong>Airline:</strong> {carrierCode}
                </p>
                <p>
                  <strong>From:</strong> {originCode} -{" "}
                  <strong>To:</strong> {destinationCode}
                </p>
                <p>
                  <strong>Departure:</strong> {segment.departure.at}
                </p>
                <p>
                  <strong>Price:</strong> {flight.price.currency} {flight.price.total}
                </p>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.preventDefault()}
                >
                  Book Now
                </a>
              </div>
            );
          })
        ) : (
          !loading && <p>No flights found.</p>
        )}
      </div>
    </div>
  );
};

export default AmadeusCitySearch;
