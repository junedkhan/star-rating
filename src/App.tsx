import React, { useState, useEffect, useCallback } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import "./styles.css";

type StarComponentProps = {
  value?: number; // Controlled mode support
  onChange: (value: number) => void;
  numberOfStar: number;
};

const StarComponent = React.memo(
  ({ value, onChange, numberOfStar }: StarComponentProps) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(value || 0);
    const [hoverState, setHoverState] = useState<number>(0);

    const currentValue = isControlled ? value : internalValue;

    useEffect(() => {
      if (isControlled) {
        setInternalValue(value!);
      }
    }, [value, isControlled]);

    const handleSelect = useCallback(
      (starValue: number) => {
        if (!isControlled) setInternalValue(starValue);
        onChange(starValue);
      },
      [onChange, isControlled]
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const index = Number((e.target as HTMLElement).dataset.index);
      if (!isNaN(index)) setHoverState(index + 1);
    };

    const handleMouseLeave = () => setHoverState(0);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      console.log("e", e.key);
      if (e.key === "ArrowRight") {
        setInternalValue((prev) => Math.min(prev + 1, numberOfStar));
      } else if (e.key === "ArrowLeft") {
        setInternalValue((prev) => Math.max(prev - 1, 1));
      } else if (e.key === "Enter") {
        onChange(internalValue);
      }
    };
    console.log("currentValue", currentValue);

    return (
      <div
        className="stars-container"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="radiogroup"
        aria-label="Star rating"
      >
        {Array.from({ length: numberOfStar }).map((_, index) => {
          const starValue = index + 1;
          return (
            <button
              key={index}
              onClick={() => handleSelect(starValue)}
              data-index={index}
              aria-label={`Rate ${starValue} stars`}
              className="star-button"
            >
              {hoverState >= starValue || currentValue >= starValue ? (
                <FaStar className="star-icon" color="orange" />
              ) : (
                <FaRegStar className="star-icon" />
              )}
            </button>
          );
        })}
      </div>
    );
  }
);

export default function App() {
  const [rating, setRating] = useState(undefined);

  return (
    <div className="App">
      <h2>Star Rating Component</h2>
      <StarComponent value={rating} onChange={setRating} numberOfStar={5} />
      <p>Selected Rating: {rating}</p>
    </div>
  );
}
