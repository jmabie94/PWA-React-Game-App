import './formcontainer.css'
import { useRef, useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utils/mutations';
import AuthService from '../../utils/auth.js'

const FormContainer = () => {
    // const [formState, setFormState] = useState({ email: '', password: '' });
    // const [login, { error, data }] = useMutation(LOGIN_USER);
    const [login, setLogin] = useState(true);

    const ref = useRef(null);

    // const handleFormSubmit = async (event) => {
    //     event.preventDefault();
    //     console.log(formState);
    //     try {
    //       const { data } = await login({
    //         variables: { ...formState },
    //       });
    
    //       AuthService.login(data.login.token);
    //     } catch (e) {
    //       console.error(e);
    //     }
    
    //     // clear form values
    //     setFormState({
    //       email: '',
    //       password: '',
    //     });
    //   };

    const handleFormSubmit = () => {
        setLogin(!login);
        ref.current.classList.toggle('active');
    }


    return (
        <div className='form-container' ref={ref}>
            {<Login />}
            <div className='side-div'>
                <button type='button' onClick={handleFormSubmit}> 
                    {''}
                    {login ? 'Signup' : 'Login'}
                </button>
            </div>
            {<Signup />}
        </div>
    )
}

export default FormContainer