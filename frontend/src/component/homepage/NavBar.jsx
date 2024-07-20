import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
    const [signinedUser, setSigninedUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setSigninedUser(localStorage.getItem('signinedUser') || 'Guest');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('signinedUser');
        setSigninedUser('Guest');
        navigate('/signin');
    };

    return (
        <>
            <nav className="navbar--container">
                <div className="navbar--title">
                    StockTracker Hub
                </div>
                <div className="navbar--info">
                    <div className="navbar--profile">
                        <div className="navbar--profile--photo">
                            <img src="./photos/profile_photo.png" alt="profile" />
                        </div>
                        <h2>{signinedUser}</h2>
                    </div>
                    <div className="navbar--logout">
                        <button className="navbar--btn" onClick={handleLogout}>Log out</button>
                    </div>
                </div>
            </nav>
        </>
    );
}