"use client";

import { useState } from "react";

export default function StarRating({
  totalStars = 5,
  value,
  onChange,
  readOnly = false,
  className = "",
}) {
  const [internalRating, setInternalRating] = useState(0);
  const [hover, setHover] = useState(0);

  // 만약 value prop이 있으면 controlled mode로 동작, 없으면 내부 state 사용
  const currentRating = value !== undefined ? value : internalRating;

  const handleRating = (val) => {
    if (readOnly) return;
    if (currentRating === val) {
      if (value !== undefined) {
        onChange && onChange(0);
      } else {
        setInternalRating(0);
        onChange && onChange(0);
      }
    } else {
      if (value !== undefined) {
        onChange && onChange(val);
      } else {
        setInternalRating(val);
        onChange && onChange(val);
      }
    }
  };

  return (
    <div className={`flex flex-row-reverse justify-end text-xl space-x-reverse space-x-0.5 ml-2 ${className}`}>
      {Array.from({ length: totalStars }, (_, index) => {
        const starValue = totalStars - index;
        return (
          <label
            key={starValue}
            className={`
              ${!readOnly ? "cursor-pointer" : ""}
              transition-colors duration-300
              ${(hover || currentRating) >= starValue ? "text-yellow-500" : "text-gray-400"}
            `}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => { if (!readOnly) setHover(starValue); }}
            onMouseLeave={() => { if (!readOnly) setHover(0); }}
          >
            ★
          </label>
        );
      })}
    </div>
  );
}
