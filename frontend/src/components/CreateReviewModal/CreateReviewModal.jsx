import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import * as sessionActions from '../../store/session';
import './CreateReview.css';

function CreateReviewModal({ spotId }) { 
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(null); 
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(''); 
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setServerError(''); 

    return dispatch(
      sessionActions.createreview(spotId, {
        review,
        stars
      })
    )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
        if (data?.message) {  
          setServerError(data.message); 
        }
      });
  };

  const isButtonDisabled = review.length < 10 || stars === null;

  return (
    <div id='reviewform'>
      <h1>How was your stay?</h1>
      {serverError && <p className="server-error">{serverError}</p>}
      {errors.review && <p>{errors.review}</p>}
      {errors.stars && <p>{errors.stars}</p>}

      <form onSubmit={handleSubmit}>
        <label>
            <input className='longinput'
            type="text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
            placeholder="Leave your review here..."
            minLength="10" 
            />
        </label>

        <label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${stars >= star ? 'selected' : ''}`}
                onClick={() => setStars(star)}
              >
                ★
              </span> 
            ))}
            Stars
          </div>
        </label>

        <button type="submit" disabled={isButtonDisabled}>Submit Your Review</button>
      </form>
    </div>
  );
}

export default CreateReviewModal;
