import React, { useState } from "react";
import "./StarRating.css";

export default function StarRating({ rating, setRating }) {
  // rating: seçilmiş reytinq (0-5)
  // setRating: seçimi dəyişmək üçün funksiya (optional, əgər kliklə dəyişmək istəyirsənsə)

  const handleClick = (value) => {
    if (setRating) setRating(value);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? "filled" : "empty"}`}
          onClick={() => handleClick(star)}
          role="button"
          aria-label={`${star} star`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleClick(star);
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
