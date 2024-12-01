import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateSpot } from '../../store/session';

function EditSpotModal({ spot, closeModal, onUpdate }) {
  const dispatch = useDispatch();
  
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [country, setCountry] = useState(spot.country);
  const [name, setName] = useState(spot.name);
  const [description, setDescription] = useState(spot.description);
  const [price, setPrice] = useState(spot.price);
  const [imagePrev, setImagePrev] = useState(spot.imagePrev);

  useEffect(() => {
    setAddress(spot.address);
    setCity(spot.city);
    setState(spot.state);
    setCountry(spot.country);
    setName(spot.name);
    setDescription(spot.description);
    setPrice(spot.price);
    setImagePrev(spot.imagePrev)
  }, [spot]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const updatedSpotData = {
      address,
      city,
      state,
      country,
      name,
      description,
      price,
      imagePrev
    };

      await dispatch(updateSpot(spot.id, updatedSpotData));
      closeModal();
      onUpdate(spot.id);
    
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h2>Update Spot</h2>

        <label>
          Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>

        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>

        <label>
          State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>

        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>

        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <input className='longinput'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        <label>
          Preview Image
          <input
            type="text"
            value={imagePrev}
            onChange={(e) => setImagePrev(e.target.value)}
            required
          />
        </label>

        <button type="submit">Update Spot</button>
      </form>
    </div>
  );
}

export default EditSpotModal;
