import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './component/homepage/index';
import SignIn from './component/authentication/SignIn.jsx';
import SignUp from './component/authentication/SignUP';
import { useState, useEffect } from 'react';

export default function App() {
  const [isSignin, setIsSignin] = useState(false);

  useEffect(() => {
    setIsSignin(localStorage.getItem('isSignin'));
    console.log(isSignin);
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/signin' />} />
      <Route path='/homepage' element={isSignin ? <Home /> : <Navigate to='/signin' />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='*' element={<SignUp />} />
    </Routes>
  );
}