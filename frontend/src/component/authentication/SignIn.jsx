import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {

    const navigate = useNavigate();

    const [signinInfo, setSignInInfo] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignInInfo({
            ...signinInfo,
            [name]: value
        });
    }

    const handleSignIn = async(e) => {
        e.preventDefault();

        try{
            const URL = "http://localhost:5000/auth/signin";

            const res = await fetch(URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signinInfo)
            });

            const result = await res.json();
            if (result.success) {
                localStorage.setItem("token", result.jwtToken);
                localStorage.setItem("signinedUser", result.name);
                setTimeout(() => {
                    navigate('/homepage');
                });
            } else {
                alert("Error occured")
            }

        }catch(e){
            console.error(e);
        }
    }
    
    return (
        <>
            <div id="signin" className="signin--container">
                <h1>Sign In</h1>
                <form onSubmit={handleSignIn}>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder="Enter Email"
                        value={signinInfo.email}
                    />
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder="Enter Password"
                        value={signinInfo.password}
                    />
                    <button>SignIn</button>
                    <span>
                        Don't have an account
                        <Link to="signup">Sign up</Link>
                    </span>
                </form>
            </div>
        </>
    );
}