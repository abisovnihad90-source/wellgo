import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Map.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Map({ markers }) {
  const center = markers.length ? [markers[0].lat, markers[0].lon] : [40.4093, 49.8671];

  return (
    <section className="map-section">
      <h2>Trip Map</h2>
      <p className="map-description">
    The cities you've planned are shown below on the map. Click on any marker to view your travel dates and notes.
  </p>

  {!markers.length && (
    <p className="no-markers">
      No cities have been added to the map yet. Once you add destinations to your travel plan, they'll appear here.
    </p>
  )}
      <div className="map-wrapper">
        <MapContainer
          center={center}
          zoom={2}
          maxZoom={6}
          minZoom={2}
          scrollWheelZoom={true}
          dragging={true}
          worldCopyJump={false}
          maxBounds={[[-85, -180], [85, 180]]}
          maxBoundsViscosity={1.0}
          noWrap={true}
          className="leaflet-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            noWrap={true}
          />
          {markers.map((marker, i) => (
            <Marker key={i} position={[marker.lat, marker.lon]}>
              <Popup>
                <div className="popup-content">
                  <h4>{marker.name}</h4>
                  <small>📅 {marker.startDate} - {marker.endDate}</small>
                  <p>{marker.note ? marker.note : "Qeyd yoxdur."}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
