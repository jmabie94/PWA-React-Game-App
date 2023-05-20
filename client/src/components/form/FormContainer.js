import './formcontainer.css'
import { useRef, useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const FormContainer = () => {
    const [login, setLogin] = useState(true);

    const ref = useRef(null);

    const handleClick = () => {
        setLogin(!login);
        ref.current.classList.toggle('active');
    }


    return (
        <div className='form-container' ref={ref}>
            {<Login />}
            <div className='side-div'>
                <button type='button' onClick={handleClick}> 
                    {''}
                    {login ? 'Signup' : 'Login'} 
                </button>
            </div>
            {<Signup />}
        </div>
    )
}

export default FormContainer