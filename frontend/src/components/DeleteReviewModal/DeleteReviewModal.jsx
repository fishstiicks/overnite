import './DeleteReview.css';

function DeleteReviewModal({ reviewId, onDelete, onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Delete</h2>
        <p>{`Are you sure you want to delete this review?`}</p>
        <div className="modal-actions">
          <button onClick={() => onDelete(reviewId)} className="delete-button">
            Yes (Delete Review)
          </button>
          <button onClick={onClose} className="cancel-button">
            No (Keep Review)
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteReviewModal;
