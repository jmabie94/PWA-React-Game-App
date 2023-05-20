import { Link } from 'react-router-dom';
import './navigation.css';

const NavigationBar = () => {
    return <header>
        <img className='logo' src='/' alt='logo'></img>
        <nav>
            <ul className='nav_links'>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/'>Games</Link></li>
                <li><Link to='/'>Profile</Link></li>
                <li><Link to='/'>Chat</Link></li>
            </ul>
        </nav>
        <Link className='play' to='#'><button>PLAY</button></Link>
    </header>
};

export default NavigationBar;