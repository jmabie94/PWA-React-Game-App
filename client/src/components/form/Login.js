import './login.css';
import AuthService from '../../utils/auth.js'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utils/mutations.js';

const Login = () => {
    return (
        <div className='login'>
            <h1>Login</h1>
            <form>
                <input type={'email'} placeholder={'Email'}/>
                <input type={'password'} placeholder={'Password'}/>
                <button type={'submit'}>Login</button>
            </form>
        </div>
    )
}

export default Login