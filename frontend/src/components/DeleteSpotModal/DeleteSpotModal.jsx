import './DeleteSpot.css';

function DeleteSpotModal({ spotId, onDelete, onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Delete</h2>
        <p>{`Are you sure you want to remove this spot?`}</p>
        <div className="modal-actions">
          <button onClick={() => onDelete(spotId)} className="delete-button">
            Yes (Delete Spot)
          </button>
          <button onClick={onClose} className="cancel-button">
            No (Keep Spot)
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteSpotModal;