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

    taskName: String
  }

  const AIPopUp: React.FC<AIPopUpProps> = ({ ratings, onClose, taskName }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);

    
    async function APICALL() {
      console.log(ratings)
      const response = await fetch('/api/recommendations',{
      method: 'POST',
      body: JSON.stringify({
        data: {ratings:ratings,taskName: taskName}
      }),
      headers:{
        'Content-Type':'application/json'
      }
    })
      setLoading(false)
      console.log(response)
      console.log(response.json().then((i)=>{
        console.log(i.result)
        setResult(i.result)
      }))
    }
   
    useEffect(()=>{
      APICALL()
    },[])


  return (
    <div className="popup-container">
        <button className="close-button" onClick={onClose}>
        X
      </button>
      <div className="popup-content">
      {loading &&<div >
        { <HamsterLoader />}
        </div>}
        {result && <div className='AItext'>AI Result: {result}</div>}
      </div>
    </div>
  );
};

export default AIPopUp;
