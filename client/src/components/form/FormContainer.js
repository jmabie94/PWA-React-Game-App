import './formcontainer.css'
import { useRef, useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const FormContainer = () => {

    const [login, setLogin] = useState(false);

    const ref = useRef(null);

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
                    {login ? 'Login' : 'Signup'}
                </button>
            </div>
            {<Signup />}
        </div>
    )
}

export default FormContainer