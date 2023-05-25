import '../lobby/navigation.css';
import './profile.css';

import Auth from '../../utils/auth';
import { useQuery } from '@apollo/client';

import { GET_USER_BY_EMAIL } from '../../utils/queries';

export default function Profile() {
  // const { loading, data } = useQuery(GET_ME);
  // console.log('data = ', data);
  // const userData = data?.me || {};
  // need to get ID rather than email from localStorage
  const email = localStorage.getItem('email'); //using as an example until login implementation works

  const { loading, data, error } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email },
  });
  const userData = data?.user || error;

  console.log(userData);

  function generateRecords() {
    let recordsArray = [];
    if (userData.records.length) {
      for (let index = 0; index < userData.records.length; index++) {
        recordsArray.push(
          <li>
            <h3>{userData.records[index].gameName}</h3>
            <ul>
              <li>
                Games Played:
                {userData.records[index].gamesPlayed}
              </li>
              <li>
                Games Won:
                {userData.records[index].gamesWon}
              </li>
              <li>
                Games Lost:
                {userData.records[index].gamesLost}
              </li>
              <li>
                Games Tied:
                {userData.records[index].gamesTied}
              </li>
            </ul>
          </li>
        );
      }
    }
    return recordsArray;
  }

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
            <h2>Your Stats </h2>
            <ul>{generateRecords()}</ul>
            <button id="logout" onClick={Auth.logout}>
              Log Out
            </button>
          </div>
        </>
      ) : (
        <h1>You must be logged in!</h1>
      )}
    </div>
  );
}
