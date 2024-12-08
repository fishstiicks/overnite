import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { removereview } from '../../store/session'; 
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import CreateReviewModal from "../CreateReviewModal/CreateReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import './SpotDetails.css';

function SpotDetailsPage() {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null); 
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();  
  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  const updateReviewsList = (newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  useEffect(() => {

    fetch(`/api/spots/${spotId}`)
      .then((response) => response.json())
      .then((data) => setSpot(data))


    fetch(`/api/spots/${spotId}/reviews`)
      .then((response) => response.json())
      .then((data) => {
        const sortedReviews = data.Reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(sortedReviews);
        const userReview = data.Reviews.find((review) => review.User.id === sessionUser?.id);
        setUserReview(userReview);
      })
  }, [spotId, sessionUser?.id]);

  if (!spot) {
    return <p>Spot not found.</p>;
  }

  const isOwner = sessionUser && spot.ownerId === sessionUser.id;

  const showReviewButton = !isOwner && !userReview && sessionUser;

  const handleDeleteReview = async (reviewId) => {
          dispatch(removereview(reviewId)); 
          setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
          setReviewToDelete(null); 
  }
  
  const closeDeleteModal = () => {
    setReviewToDelete(null);
  };

  const reviewCountText = reviews.length === 1 ? "1 Review" : `${reviews.length} Reviews`;

  const avgRating = spot.avgRating ? spot.avgRating.toFixed(1) : null;

  return (
    <div className="spot-details-page">
      <h2>{spot.name}</h2>
      <p>{spot.city}, {spot.state}, {spot.country}</p>

      <div className="spot-images">
        <img src={spot.imagePrev} className="large-image"></img>
        <div className="small-images">
            <img src={spot.imageOne} className="small-image"></img>
            <img src={spot.imageTwo} className="small-image"></img>
            <img src={spot.imageThree} className="small-image"></img>
            <img src={spot.imageFour} className="small-image"></img>
      </div>
      </div>

      <div className="spot-underpics">
      <div className="spot-details">
        <h3>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h3>
        <p>{spot.description}</p>
      </div>

      <div className="callout-box">
        <h3>${spot.price} / night</h3>
        {avgRating !== null ? (
          <p>
            <strong>★</strong> {avgRating} 
            {reviews.length > 0 && ` · ${reviewCountText}`}
          </p>
        ) : (
          <p>
            <strong>★</strong> New
          </p>
        )}
              <button 
          className="reserve-button"
          onClick={handleReserveClick}
        >
          Reserve
        </button>
      </div>
      </div>

      <hr></hr>
      <div className="reviews-section">
        <h2>Rating and Reviews</h2>
        {avgRating !== null ? (
          <p>
            <strong>★</strong> {avgRating} · {reviews.length > 0 ? reviewCountText : null}
          </p>
        ) : (
          <p>
            <strong>★</strong> New
          </p>
        )}

        {showReviewButton && (
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<CreateReviewModal spotId={spotId} updateReviews={updateReviewsList} />}
          />
        )}

        {userReview && <p>You have already reviewed this spot.</p>}
        
        {reviews.length === 0 && sessionUser && !isOwner && (
          <p>Be the first to post a review!</p>
        )}

        {reviews.length === 0 && isOwner ? (
          <p>No reviews yet.</p>
        ) : (
          <ul>
            {reviews.map((review) => {
              const reviewDate = new Date(review.createdAt);
              const formattedDate = reviewDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              });

              return (
                <li key={review.id}>
                  <p><strong>{review.User.firstName}</strong> {formattedDate}</p>
                  <p>{review.review}</p>
                  <p>Rating: {review.stars}</p>

                  {sessionUser && review.User.id === sessionUser.id && (
                    <OpenModalButton
                      buttonText="Delete"
                      modalComponent={
                        <DeleteReviewModal
                          reviewId={review.id}
                          onDelete={handleDeleteReview}
                          onClose={closeDeleteModal}
                        />
                      }
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {reviewToDelete && (
        <DeleteReviewModal
          reviewId={reviewToDelete}
          onDelete={handleDeleteReview}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

export default SpotDetailsPage;
