import { Link } from 'react-router-dom';
import AuthService from '../../utils/auth';
import { useQuery } from '@apollo/client';
import { QUERY_SINGLE_USER } from '../../utils/queries.js';
import './navigation.css';

const NavigationBar = () => {
  const email = localStorage.getItem('email');

  const { loading, data, error } = useQuery(QUERY_SINGLE_USER, {
    variables: { email },
  });

  const userData = data?.user || error;
  console.log(userData);

  return (
    <header>
      <img className="logo" src="/" alt="logo"></img>
      {AuthService.loggedIn() && userData !== undefined ? (
        <h1 id="navh1">Welcome, {userData.username}</h1>
      ) : (
        <h1 id="navh1">Login or sign up to play!</h1>
      )}
      <nav>
        <ul className="nav_links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/games">Games</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/">Chat</Link>
          </li>
        </ul>
      </nav>
      {AuthService.loggedIn() ? (
        <>
          <Link className="play" to="/games">
            <button>PLAY</button>
            <button id="logout" onClick={AuthService.logout}>
              Log Out
            </button>
          </Link>
        </>
      ) : (
        <Link className="play" to="/games">
          <button>PLAY</button>
        </Link>
      )}
    </header>
  );
};

export default NavigationBar;
