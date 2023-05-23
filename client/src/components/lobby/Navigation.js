import { Link } from 'react-router-dom';
import './navigation.css';

const NavigationBar = () => {
    return <header>
        <img className='logo' src='/' alt='logo'></img>
        <nav>
            <ul className='nav_links'>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/games'>Games</Link></li>
                <li><Link to='/'>Profile</Link></li>
                <li><Link to='/chat'>Chat</Link></li>
            </ul>
        </nav>
        <Link to='/games' className='play'><button>PLAY</button></Link>
    </header>
};

export default NavigationBar;