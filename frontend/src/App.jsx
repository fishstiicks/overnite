
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import SpotsPage from './components/SpotsPage/SpotsPage';
import SpotManagementPage from './components/SpotManagementPage/SpotManagementPage'; 
import * as sessionActions from './store/session';
import SpotDetailsPage from './components/SpotDetailsPage/SpotDetailsPage';
import { Link } from 'react-router-dom';


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <div className='header'>
    <Link to="/">
    <img src="https://static.vecteezy.com/system/resources/thumbnails/003/731/316/small/web-icon-line-on-white-background-image-for-web-presentation-logo-icon-symbol-free-vector.jpg"></img>
    </Link>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    <hr></hr>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotsPage />
      },
      {
        path: '/manage', 
        element: <SpotManagementPage />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetailsPage />
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;