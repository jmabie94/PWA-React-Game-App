import '../lobby/navigation.css';
import './profile.css';

import React from 'react';
import Auth from '../../utils/auth';
import { useQuery, useMutation } from '@apollo/client';

import { GET_USER_BY_EMAIL, GET_USER } from '../../utils/queries';
import { CREATE_PROFILE } from '../../utils/mutations';

// refactor for multiple queries
export default function NewProfile() {
    // get the email
    const email = localStorage.getItem('email');

    // get the user by their email, aiming for the id
    const userEmail = useQuery(GET_USER_BY_EMAIL, {
        variables: { email },
    });

    // make sure the user shows up
    const userData = userEmail.data?.user

    // test formatting
    console.log("User Data:", userData);
    
    // set the userId
    const userId = userData.id;

    // test userId
    console.log("User Id:", userId);

    // get the full user model from the userId
    const userIdData = useQuery(GET_USER, {
        variables: { id: userId },
    });

    // stage to check the full user model is received
    const dataProfile = userIdData;
    
    // test the full user model
    console.log("Data Profile: ", dataProfile);

    // set CREATE_PROFILE as a function()
    // const [createProfile] = useMutation(CREATE_PROFILE);

    // if the full user model has no profile information, create a new profile
    // missing useEffect if statement thing

    // get the full profile of the user
    const fullProfile = useMutation(CREATE_PROFILE, {
        variables: { userId: userId },
    });

    // test the full profile
    console.log("Full Profile: ", fullProfile)

    const error = userEmail.error || userIdData.error || fullProfile.error;
    const loading = userEmail.loading || userIdData.loading || fullProfile.loading;

    if (loading) {
        return <h2>LOADING...</h2>;
    }

    if (error) {
        return <h2>Error: {error.message}</h2>;
    }

    return (
        <div>
            {Auth.loggedIn() ? (
                <>
                    <h1>Welcome, User</h1>
                    {fullProfile.gameStats ? (
                        <div className='stats-container'>
                            <h2>Your Stats:</h2>
                            <ul className='stat-list'>
                                {fullProfile.gameStats.map((gameStat) => {
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