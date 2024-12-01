import { csrfFetch } from './csrf';

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const SET_SPOT = "spots/setSpot";
const SET_USER_SPOTS = 'session/setUserSpots';
const REMOVE_SPOT = "spots/removeSpot";

const SET_REVIEW = "spots/setReview";
const REMOVE_REVIEW = "reviews/removeReview";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

export const removeReview = (reviewId) => {
    return {
      type: REMOVE_REVIEW,
      reviewId,
    };
  };
  
export const removeSpot = (spotId) => {
    return {
      type: REMOVE_SPOT,
      spotId,
    };
  };

export const setSpot = (spot) => {
    return {
      type: SET_SPOT,
      payload: spot
    };
  };
  
export const setReview = (review) => {
    return {
      type: SET_REVIEW,
      payload: review
    };
  };


// SIGNUP
export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password
      })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };

// LOGIN
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// LOGOUT
export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'DELETE'
    });
    dispatch(removeUser());
    return response;
  };

// RESTORE USER
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };

// CREATE SPOT
export const createspot = (spot) => async (dispatch) => {
    const { address, city, state, country, name, description, price, imagePrev, imageOne, imageTwo, imageThree, imageFour } = spot;
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      body: JSON.stringify({
        address,
        city,
        state,
        country,
        name,
        description,
        price,
        imagePrev,
        imageOne,
        imageTwo,
        imageThree,
        imageFour
      })
    });
    const data = await response.json();
    dispatch(setSpot(data.spot));
    return response;
  };


// GET USER'S SPOTS
export const fetchUserSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/user/spots");
    const data = await response.json();
  
    if (response.ok) {
      dispatch({
        type: 'SET_USER_SPOTS',
        spots: data.Spots || []  // Ensure you handle cases where the spots might be empty
      });
    } else {
      // Handle any errors here, if necessary
      console.error('Failed to fetch user spots:', data.message);
    }
  };

// DELETE SPOT
export const removespot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE'
    });
    dispatch(removeSpot(spotId));
    return response;
  };

// UPDATE SPOT
export const updateSpot = (spotId, spotData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'PUT',
      body: JSON.stringify(spotData),
    });
    
    if (response.ok) {
      const data = await response.json();
      dispatch({ type: 'UPDATE_SPOT', spot: data });
      return data; // Returning the updated spot
    } else {
      throw new Error('Failed to update spot');
    }
  };

// CREATE REVIEW
export const createreview = (spotId, newReview) => async (dispatch) => {
    const { review, stars } = newReview;
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      body: JSON.stringify({
        review,
        stars
      })
    });
    const data = await response.json();
    dispatch(setReview(data.review));
    return response;
  };

// DELETE REVIEW
export const removereview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  
    if (response.ok) {
      dispatch(removeReview(reviewId));
    }
  
    return response;
  };

  const initialState = { user: null, spots: [], spot: null, review: null };
  const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_USER:
        return { ...state, user: action.payload };
      case REMOVE_USER:
        return { ...state, user: null, spots: [] };
      case SET_USER_SPOTS:
        return { ...state, spots: action.payload };
      case SET_SPOT:
        return { ...state, spot: action.payload };
      case REMOVE_SPOT:
        return {
          ...state,
          spots: state.spots.filter((spot) => spot.id !== action.spotId)
        };
      case 'UPDATE_SPOT':
        return {
          ...state,
          spots: state.spots.map((spot) =>
            spot.id === action.payload.id ? action.payload : spot
          ),
          spot: action.payload,
        };
      case SET_REVIEW:
        return { ...state, review: action.payload };
    case REMOVE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.filter((review) => review.id !== action.reviewId), // Remove review by ID
      };
    default:
      return state;
  }
  };
  

export default sessionReducer;