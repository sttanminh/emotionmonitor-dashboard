import React, { useState, useEffect } from 'react';
import HamsterLoader from './hamsterLoader';

interface AIPopUpProps {
    ratings: {
      id: string;
      emoScore: number;
      level: number;
      metric: {
        name: string;
        levels: { levelLabel: string; levelOrder: number }[];
      };
    }[] | null;

    onClose: () => void;
  }

  const AIPopUp: React.FC<AIPopUpProps> = ({ ratings, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    console.log(ratings)
    fetch(`/api/recommendations?data=${ratings}`)
      .then((res) => res.json())
      .then((res) => {
        setResult(res);
        setLoading(false);
      });
  }, []);

  return (
    <div className="popup-container">
        <button className="close-button" onClick={onClose}>
        X
      </button>
      <div className="popup-content">
        {loading && <HamsterLoader />}
        {result && <div>AI Result: {result}</div>}
      </div>
    </div>
  );
};

export default AIPopUp;
