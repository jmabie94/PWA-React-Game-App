import './login.css';
import AuthService from '../../utils/auth.js';
import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utils/mutations.js';

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_USER);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });
      console.log(data);
      AuthService.login(data.login.token);
      if (localStorage.getItem('email') !== null) {
        localStorage.removeItem('email');
        localStorage.setItem('email', formState.email);
      } else {
        localStorage.setItem('email', formState.email);
      }
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      email: '',
      password: '',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form>
        <input
          type={'email'}
          name={'email'}
          placeholder={'Email'}
          onChange={handleInputChange}
        />
        <input
          type={'password'}
          name={'password'}
          placeholder={'Password'}
          onChange={handleInputChange}
        />
        <button type={'submit'} onClick={handleFormSubmit}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
