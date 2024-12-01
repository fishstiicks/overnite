import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); 
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data.errors) {
         setErrors({ credentials: 'The provided credentials were invalid' });
        }
      });
  };


  const isFormValid = credential.length >= 4 && password.length >= 6;

  return (
  <div id='login-body'>
      <h1>Log In</h1>
        <div className='errortext'>{errors.credentials && <p>{errors.credentials}</p>}
        {errors.credential && <p>{errors.credential}</p>}</div>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            placeholder='Username or Email'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <br></br>
        <label>
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br></br>

        <button type="submit" disabled={!isFormValid}>Log In</button>
      </form>
     </div>
  );
}

export default LoginFormModal;
