import './signup.css';
import AuthService from '../../utils/auth.js';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../../utils/mutations.js';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [signUp, {error, data }] = useMutation(CREATE_USER);

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await signUp({
        variables: { ...formState },
      });
      
      console.log(data);
      AuthService.login(data.createUser.token);
      if (localStorage.getItem('email') !== null) {
        localStorage.removeItem('email');
        localStorage.setItem('email', formState.email);
      } else {
        localStorage.setItem('email', formState.email);
      }
    } catch (err) {
      console.error(err);
    }
    setFormState({
      username: '',
      email: '',
      password: '',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <div className="signup">
      <h1>Sign Up</h1>
      <form>
        <input
          type={'username'}
          placeholder={'Username'}
          name={'username'}
          onChange={handleInputChange}
        />
        <input
          type={'email'}
          placeholder={'Email'}
          name={'email'}
          onChange={handleInputChange}
        />
        <input
          type={'password'}
          placeholder={'Password'}
          name={'password'}
          onChange={handleInputChange}
        />
        {/* <input type={'password'} placeholder={'Confirm Password'} name={'password'} onChange={handleInputChange} /> */}
        <button type={'submit'} onClick={handleSignupSubmit}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
