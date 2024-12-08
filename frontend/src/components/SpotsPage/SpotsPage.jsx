import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SpotsPage.css';

function SpotsPage() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    fetch('/api/spots')
      .then((response) => response.json())
      .then((data) => {
        setSpots(data);  
      })
      .catch((error) => {
        console.error('Error fetching spots:', error);  
      });
  }, []);

  return (
    <div>
      <div className="spot-list">
        {spots.length > 0 ? (
          spots.map((spot) => (
            <div key={spot.id} className="spot-item" title={spot.name}>
              <Link to={`/spots/${spot.id}`}>
                <img src={spot.imagePrev} alt={spot.name} className="spot-image" />
                
                <div className="spotheader">
                <p>{spot.city}, {spot.state}</p>
                  <div className="spot-rating">
                    <span className="star-icon">★</span>
                    <span>{spot.avgRating ? spot.avgRating.toFixed(1) : "New"}</span> 
                  </div>
                </div>
                <div className="spotprice"><p><strong>${spot.price}</strong> / night</p></div>
              </Link>
            </div>
          ))
        ) : (
          <p>No spots available.</p>
        )}
      </div>
    </div>
  );
}

export default SpotsPage;
