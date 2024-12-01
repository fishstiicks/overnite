import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import CreateSpotModal from '../CreateSpotModal/CreateSpotModal';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(prevState => !prevState); // Toggle the menu state
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false); // Close the menu if clicked outside
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    navigate('/');
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="profile-button-container">
      {user ? (
        
        <div className="user-menu">
            <OpenModalButton
                buttonText="Create Spot"
                modalComponent={<CreateSpotModal />}
              />
          
          <button onClick={toggleMenu} className="profile-button">
            <FaUserCircle />
          </button>

          <ul className={ulClassName} ref={ulRef}>
            <p>Hello, <b>{user.firstName}</b>
            <br></br>
            {user.email}</p>
              <Link to="/manage">Spot Management</Link>
            <br></br>
              <button className='logout-button' onClick={logout}>Log Out</button>
          </ul>
        </div>
      ) : (

        <div className="auth-buttons">
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </div>
      )}
    </div>
  );
}

export default ProfileButton;
