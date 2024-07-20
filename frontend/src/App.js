import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './component/homepage/index';
import SignIn from './component/authentication/SignIn.jsx';
import SignUp from './component/authentication/SignUP';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/homepage' />} />
      <Route path='/homepage' element={<Home />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />
    </Routes>
  );
}