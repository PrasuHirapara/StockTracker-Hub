import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {

    const navigate = useNavigate();

    const [signupInfo, setSignupInfo] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo({
            ...signupInfo,
            [name]: value
        });
    }

    const handleSignUp = async(e) => {
        e.preventDefault();

        try{
            const URL = "http://localhost:5000/auth/signup";

            const res = await fetch(URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });

            const result = await res.json();
            if (result.success) {
                setTimeout(() => {
                    navigate('/login');
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
            <div id="signup" className="signup--container">
                <h1>Sign Up</h1>
                <form onSubmit={handleSignUp}>
                    <label htmlFor='name'>Name</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='name'
                        autofocus
                        placeholder="Enter Name"
                        value={signupInfo.name}
                    />
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder="Enter Email"
                        value={signupInfo.email}
                    />
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder="Enter Password"
                        value={signupInfo.password}
                    />
                    <button>SignUp</button>
                    <span>
                        Already have an account ?
                        <Link to="signin">Login</Link>
                    </span>
                </form>
            </div>
        </>
    );
}