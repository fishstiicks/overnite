import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
import CreateSpotModal from '../CreateSpotModal/CreateSpotModal';
import EditSpotModal from '../EditSpotModal/EditSpotModal';
import { removespot } from '../../store/session';
import { Link, useNavigate } from 'react-router-dom'; 

function SpotManagementPage() {
  const [spots, setSpots] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [currentSpot, setCurrentSpot] = useState(null); 
  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/user/spots')
      .then((response) => response.json())
      .then((data) => {
        if (data.Spots) {
          setSpots(data.Spots); 
        } else {
          console.error('You have no properties.', data);
          setSpots([]); 
        }
      })
  }, []);


  const handleDeleteSpot = async (spotId) => {
    try {
      await dispatch(removespot(spotId));
      setSpots(spots.filter((spot) => spot.id !== spotId));
    } catch (error) {
      console.error('Failed to delete spot:', error);
    }
  };

  const handleEditSpot = (spot) => {
    setCurrentSpot(spot);
    setIsModalOpen(true); 
  };

  const onUpdate = (spotId) => {
    navigate(`/spots/${spotId}`); 
  };

  return (
    <div>
      <h1>Manage Spots</h1>

      {spots.length === 0 && (
        <OpenModalButton
          buttonText="Create Spot"
          modalComponent={<CreateSpotModal />}
        />
      )}

      <div className="spot-list">
        {spots.length > 0 && spots.map((spot) => (
          <div key={spot.id} className="spot-item" title={spot.name}>
            <Link to={`/spots/${spot.id}`}>
              <img src={spot.previewImage} alt={spot.name} className="spot-image" />
              <h2>{spot.name}</h2>
              <p>{spot.description}</p>
              <p><strong>${spot.price}</strong> / night</p>
              <p>Avg Rating: {spot.avgRating}</p>
              <p>{spot.city}, {spot.state}</p>
            </Link>

            <OpenModalButton
              buttonText="Update"
              modalComponent={
                <EditSpotModal
                  spot={spot} 
                  closeModal={() => setIsModalOpen(false)} 
                  onUpdate={() => onUpdate(spot.id)} 
                />
              }
              onClick={() => handleEditSpot(spot)} 
            />

            <OpenModalButton
              buttonText="Delete"
              modalComponent={
                <DeleteSpotModal
                  spotId={spot.id}
                  spotName={spot.name}
                  onDelete={handleDeleteSpot} 
                />
              }
            />
          </div>
        ))}
      </div>


      {isModalOpen && currentSpot && (
        <EditSpotModal
          spot={currentSpot} 
          onUpdate={(spotId) => onUpdate(spotId)} 
          closeModal={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

export default SpotManagementPage;
