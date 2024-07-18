import { BrowserRouter, Router, Route } from 'react-router-dom'
import Home from './component/homepage/index'
import Login from './component/authentication/LogIn';
import SignUp from './component/authentication/SignUP';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Router>
          <Route path='/' element={<Home />}></Route>
          <Route path='/signin' element={<Login />}></Route>
          <Route path='/signup' element={<SignUp />}></Route>
        </Router>
      </BrowserRouter>
    </>
  );
}