import React, { useState, useEffect } from "react";
import "./Planner.css";
import { useNavigate } from "react-router-dom";

export default function Planner({ markers, setMarkers }) {
  const [cities, setCities] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
const [editNote, setEditNote] = useState("");
  const [formData, setFormData] = useState({
    city: "",
    startDate: "",
    endDate: "",
    note: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCities() {
      try {
        const res1 = await fetch("https://683821582c55e01d184c0d9e.mockapi.io/api/cities/city");
        const data1 = await res1.json();

        const res2 = await fetch("https://683a07db43bb370a8671a201.mockapi.io/api/cities/city");
        const data2 = await res2.json();

        // Adları eyni olanları birləşdir (və ya istədiyin qaydada merge et)
        const merged = [...data1, ...data2].reduce((acc, city) => {
          if (!acc.some(c => c.name === city.name)) {
            acc.push(city);
          }
          return acc;
        }, []);

        setCities(merged);
      } catch (err) {
        console.error("Şəhərlər yüklənmədi:", err);
      }

      const storedCity = localStorage.getItem("selectedCity");
      if (storedCity) {
        setFormData((prev) => ({
          ...prev,
          city: storedCity,
        }));
        localStorage.removeItem("selectedCity");
      }
    }

    fetchCities();
  }, []);

  const handleMap = (cityName) => {
    localStorage.setItem("selectedCity", cityName);
    navigate("/wellgo/map");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddMarker = (e) => {
    e.preventDefault();

    if (!formData.city || !formData.startDate || !formData.endDate) {
      alert("Zəhmət olmasa bütün sahələri doldurun.");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert("Başlanğıc tarixi son tarixdən böyük ola bilməz.");
      return;
    }

    const city = cities.find((c) => c.name === formData.city);
    if (!city) {
      alert("Şəhər tapılmadı");
      return;
    }

    const alreadyExists = markers.some((m) => m.name === formData.city);
    if (alreadyExists) {
      alert("Bu şəhər artıq əlavə olunub.");
      return;
    }

    const newMarker = {
      ...city,
      startDate: formData.startDate,
      endDate: formData.endDate,
      note: formData.note,
    };

    setMarkers((prev) => [...prev, newMarker]);

    setFormData({ city: "", startDate: "", endDate: "", note: "" });
  };

  const handleDelete = (index) => {
    setMarkers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    if (confirm("Bütün planlar silinsin?")) {
      setMarkers([]);
    }
  };

  const handleEdit = (index, currentNote) => {
  if (editIndex === index) {
    // Cancel edit
    setEditIndex(null);
    setEditNote("");
  } else {
    // Start edit
    setEditIndex(index);
    setEditNote(currentNote);
  }
};

const handleNoteChange = (e) => {
  setEditNote(e.target.value);
};

const handleSaveNote = (index) => {
  setMarkers((prev) =>
    prev.map((marker, i) =>
      i === index ? { ...marker, note: editNote } : marker
    )
  );
  setEditIndex(null);
  setEditNote("");
};


  return (
    <div className="planner1">
      <div className="trip-planner">
        <div className="form-section">
          <form className="form" onSubmit={handleAddMarker}>
            <h1>Plan your trip</h1>
            <select name="city" value={formData.city} onChange={handleChange} required>
              <option value="">Select a city</option>
              {[...cities]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((c) => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
            </select>

            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
            <input
              name="note"
              placeholder="Note..."
              value={formData.note}
              onChange={handleChange}
            />

            <button className="add-button" type="submit">
              Add
            </button>
            <button className="clear-all" type="button" onClick={handleClearAll}>
              Delete all
            </button>
          </form>
        </div>

        <div className="plans-section">
{markers.map((m, i) => (
  <div key={i} className="plancard">
    <div>
      <u><b>{m.name}</b></u>{" "}
      <i>{m.startDate} - {m.endDate}</i>

      {editIndex === i ? (
        <>
          <input
            value={editNote}
            onChange={handleNoteChange}
          />
          <button className="save-btn" onClick={() => handleSaveNote(i)}>
            Save
          </button>
        </>
      ) : (
        <p>{m.note || "no info"}</p>
      )}
    </div>

    <div className="buttons">
      <button className="map-btn" onClick={() => handleMap(m.name)}>
        Map
      </button>
      <button className="delete-btn" onClick={() => handleDelete(i)}>
        Delete
      </button>
      <button className="edit-btn" onClick={() => handleEdit(i, m.note)}>
        {editIndex === i ? "Cancel" : "Edit"}
      </button>
    </div>
  </div>


          ))}
        </div>
      </div>
    </div>
  );
}
