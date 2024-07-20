import { useEffect, useState } from "react";
import NavBar from './NavBar.jsx';
import WatchLists from './WatchLists.jsx';
import WatchList from './WatchList.jsx';

export default function Home() {

    const [signinedUser, setSigninedUser] = useState('');
    const [isSignin, setIsSignin] = useState(false);

    useEffect(() => {
        setSigninedUser(localStorage.getItem('signinedUser'));
        setIsSignin(localStorage.getItem('isSignin'))
    },[])

    return (
        <>
            <div id="homepage" className="homepage--container">
                <NavBar />
                <WatchLists />
                <WatchList />
            </div>
        </>
    );
}