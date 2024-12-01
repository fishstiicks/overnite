import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import * as sessionActions from '../../store/session';
import './CreateSpot.css';

function CreateSpotModal() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imagePrev, setImagePrev] = useState('');
  const [imageOne, setImageOne] = useState('');
  const [imageTwo, setImageTwo] = useState('');
  const [imageThree, setImageThree] = useState('');
  const [imageFour, setImageFour] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (description.length < 30) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: 'Description needs 30 or more characters',
      }));
      return;
    }

    return dispatch(
      sessionActions.createspot({
        name,
        address,
        city,
        state,
        country,
        description,
        price,
        imagePrev,
        imageOne,
        imageTwo,
        imageThree,
        imageFour
      })
    )
    .then(closeModal)

  };

  return (
    <div id='create-spot-form'>
      <h1>Create a New Spot</h1>
      {Object.keys(errors).length > 0 && (
        <div className="form-errors">
          {Object.values(errors).map((error, index) => (
            <p key={index} className="error-message">{error}</p>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <h2>{`Where's your place located?`}</h2>
        <p>Guests will only get your exact address once they book a reservation.</p>
        
        <label>
          Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        {errors.address && <p className="error-message">{errors.address}</p>}

        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        {errors.city && <p className="error-message">{errors.city}</p>}

        <label>
          State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        {errors.state && <p className="error-message">{errors.state}</p>}

        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        {errors.country && <p className="error-message">{errors.country}</p>}

        <hr>
        </hr>
        <h2>Describe your place to guests</h2>
        <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>

        <label>
          <input className='longinput'
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Please write at least 30 characters"
            minLength="30"
          />
        </label>
        {errors.description && <p className="error-message">{errors.description}</p>}

        <hr></hr>

        <h2>Create a title for your spot</h2>
        <p>{`Catch guests' attention with a spot title that highlights what makes your place special.`}</p>
        
        {errors.name && <p className="error-message">{errors.name}</p>}
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Name your spot"
          />
        </label>

        <hr></hr>

        <h2>Set a base price for your spot</h2>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        
        {errors.price && <p className="error-message">{errors.price}</p>}
        <label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="Price per night (USD)"
          />
        </label>

        <hr></hr>

        <h2>Liven up your spot with photos</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>
        
        {errors.imagePrev && <p className="error-message">{errors.imagePrev}</p>}
        <label>
          <input
            type="text"
            value={imagePrev}
            onChange={(e) => setImagePrev(e.target.value)}
            required
            placeholder="Preview Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={imageOne}
            onChange={(e) => setImageOne(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={imageTwo}
            onChange={(e) => setImageTwo(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={imageThree}
            onChange={(e) => setImageThree(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={imageFour}
            onChange={(e) => setImageFour(e.target.value)}
            placeholder="Image URL"
          />
        </label>

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
}

export default CreateSpotModal;
