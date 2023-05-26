import '../lobby/navigation.css';
import './profile.css';

import React from 'react';
import Auth from '../../utils/auth';
import { useQuery } from '@apollo/client';

import { GET_USER_BY_EMAIL, GET_USER } from '../../utils/queries';
// import { CREATE_PROFILE } from '../../utils/mutations';

// refactor for multiple queries
export default function NewProfile() {

    // get the email
    const email = localStorage.getItem('email');
    console.log("email :", email);

    // get the user by their email, aiming for the id
    const userEmail = useQuery(GET_USER_BY_EMAIL, {
        variables: { email },
    });
    console.log("userEmail: ", userEmail);

    // make sure the user shows up
    // const userData = userEmail.data?.user
    const userId = userEmail?.data?.user.id;
    console.log("User Id:", userId);

    const userIdData = useQuery(GET_USER, {
        variables: { id: userId },
    });
    const userData = userIdData;

    const error = userEmail?.error || userData?.error;
    const loading = userEmail?.loading || userData?.loading;

    if (loading) {
        return <h2>LOADING...</h2>;
    }

    if (error) {
        return <h2>Error: {error.message}</h2>;
    }

    return (
        <div>
            {Auth.loggedIn() && userData ? (
                <>
                    <h1>Welcome, {userData.data.getUser.username}</h1>
                    {userData.data.getUser.gameStats ? (
                        <div className='stats-container'>
                            <h2>Your Stats:</h2>
                            <ul className='stat-list'>
                                {userData.data.getUser.gameStats.map((gameStat) => {
                                    <li key={gameStat.id}>
                                        <strong>Game: </strong> {gameStat.game.name} <br />
                                        <strong>Wins: </strong> {gameStat.wins} <br />
                                        <strong>Draws: </strong> {gameStat.draws} <br />
                                        <strong>Losses: </strong> {gameStat.losses} <br />
                                    </li>
                                })}
                            </ul>
                        </div>
                    ) : (
                        <div className='no-stats'>
                            <h2>Start Playing Games To Earn Stats!</h2>
                        </div>
                    )}
                </>
            ) : (
                <h1>You must be logged in!</h1>
            )}
        </div>
    );
}