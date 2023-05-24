import AuthService from '../../utils/auth';
import { useRef, useState, useEffect } from 'react';
// import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws';
import { useQuery } from '@apollo/client';
import { QUERY_SINGLE_USER, GET_MESSAGES } from '../../utils/queries.js';
import './chat.css';
const apndMessage = document.getElementById('msgs');

// Todo: utilize subscription to append the message created by the createMessage mutation

const ChatWindow = () => {
    // query user to be able to check if logged in
    const email = localStorage.getItem('email');
    const { loading, data, error } = useQuery(QUERY_SINGLE_USER, {
        variables: { email },
    });
    
    const userData = data?.user || error;
    console.log(userData);

    //get all messages
    // maybe append to chat window?
    const Messages = () => {
        const { loading, data, error } = useQuery(GET_MESSAGES)
        if (!data) {
            return null;
        }
        const msgData = data;
        console.log(msgData.messages);
    }

    //calling it here to display console log may need to refactor Messages function
    Messages();

    return (
        <footer id="chatwindow">
            {/* check if logged in and display chat if they are */}
            {AuthService.loggedIn() && userData !== undefined ? (
                <div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div id="msgs">This will be where the chat goes...</div>
                        {/* onClick function that will run createMessage mutation */}
                        <button style={{alignSelf: 'center'}} onClick={''}>Send Message</button>
                    </div>
                </div>) 
                : (<div>You must be logged in to chat!</div>)}
        </footer>
    )
}



export default ChatWindow;