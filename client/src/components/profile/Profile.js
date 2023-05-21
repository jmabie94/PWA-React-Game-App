import './profile.css';

import Auth from '../../utils/auth';
import { useQuery } from '@apollo/client';
import { QUERY_SINGLE_USER } from '../../utils/queries';
import { QUERY_ALL_USERS } from '../../utils/queries';

export default function Profile() {
  const username = 'Kent Beck';
  const { loading, data } = useQuery(QUERY_ALL_USERS);
  const userData = data || {};

  console.log(userData);

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }
  return (
    <div>
      <h1>Welcome, {userData.users}</h1>

      <div className="stats-container">
        <h2>Your Stats</h2>
        <ul>
          <li>Tic-Tac-Toe Games Played: </li>
          <li>Wins/Losses: </li>
          <li></li>
        </ul>
      </div>
    </div>
  );
}

// export default function Profile() {
//   const username = 'Kent Beck';
//   const { loading, data } = useQuery(QUERY_SINGLE_USER, {
//     variables: { username },
//   });
//   const userData = data?.user || {};

//   console.log(userData);

//   // if data isn't here yet, say so
//   if (loading) {
//     return <h2>LOADING...</h2>;
//   }
//   return (
//     <div>
//       <h1>Welcome, {userData.username}</h1>

//       <div className="stats-container">
//         <h2>Your Stats</h2>
//         <ul>
//           <li>Tic-Tac-Toe Games Played: </li>
//           <li>Wins/Losses: </li>
//           <li></li>
//         </ul>
//       </div>
//     </div>
//   );
// }
