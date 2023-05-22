import './profile.css';

import Auth from '../../utils/auth';
import { useQuery } from '@apollo/client';

import { GET_ME } from '../../utils/queries';

export default function Profile() {
  const { loading, data } = useQuery(GET_ME);
  console.log('data = ', data);
  const userData = data?.me || {};

  console.log(userData);

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <div>
      {/* if user is logged in, show profile. Otherwise, show "log in" message */}
      {Auth.loggedIn() ? (
        <>
          <h1>Welcome, {userData.username}</h1>

          <div className="stats-container">
            <h2>Your Stats</h2>
            <ul>
              <li>Tic-Tac-Toe Games Played: </li>
              <li>Wins/Losses: </li>
              <li></li>
            </ul>
          </div>
        </>
      ) : (
        <h1>You must be logged in!</h1>
      )}
    </div>
  );
}
