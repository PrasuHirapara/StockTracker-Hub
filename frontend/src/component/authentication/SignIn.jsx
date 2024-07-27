import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Constant from '../../util/Constant.js';

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

    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            const URL = `${Constant.BASE_URL}/auth/signin`;
console.log(URL);
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
                localStorage.setItem("email",result.email);
                localStorage.setItem("user", result.name);
                localStorage.setItem("isSignin", result.success);
                setTimeout(() => {
                    navigate('/homepage');
                }, 500);
            } else {
                alert("Invalid Credential");
            }

        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="auth">
            <div id="signin" className="auth--container">
                <div className="auth--heading">
                    <h1>Sign In</h1>
                </div>
                <form onSubmit={handleSignIn} className="auth--form">
                    <div className="auth--form--field">
                        <label htmlFor='email'>Email</label>
                        <input
                            onChange={handleChange}
                            type='email'
                            name='email'
                            autoFocus
                            placeholder="Enter Email"
                            value={signinInfo.email}
                            required
                        />
                    </div>
                    <div className="auth--form--field">
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder="Enter Password"
                            value={signinInfo.password}
                            required
                        />
                    </div>
                    <button className='auth-btn' type='submit'>Sign In</button>
                    <div className="auth--link">
                        <span>
                            Don't have an account?
                            <Link to="/signup">  Sign up</Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}
