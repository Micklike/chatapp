import React from 'react';
import HOMEPAGE from './pages/HOMEPAGE';
import LOGINPAGE from './pages/LOGINPAGE';
import PROFILEPAGE from './pages/PROFILEPAGE';
import { Navigate, Route, Routes } from 'react-router';
import {Toaster} from "react-hot-toast"
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const App = () => {
  const {authUser}=useContext(AuthContext)
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster></Toaster>
      <Routes>

        <Route path="/" element={authUser?<HOMEPAGE/>:<Navigate to={'/login'}></Navigate>}  />
        <Route path="/login" element={!authUser?<LOGINPAGE/>:<Navigate to={'/'}></Navigate>}  />
        <Route path="/profile" element={authUser?<PROFILEPAGE/>:<Navigate to={'/login'}></Navigate>}  />
        

      </Routes>
     
    </div>
  );
}

export default App;
