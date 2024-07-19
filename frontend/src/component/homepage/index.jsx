import { useEffect, useState } from "react";

export default function Home() {

    const [signinedUser, setSigninedUser] = useState('');

    useEffect(() => {
        setSigninedUser(localStorage.getItem('signinedUser'));
    },[])

    return (
        <>
            <div id="homepage" className="homepage--container">
                <h1>{signinedUser}</h1>
            </div>
        </>
    );
}