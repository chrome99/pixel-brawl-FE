import React from 'react';
import './App.css';
import Knight from "./components/characters/Knight";
import Mage from "./components/characters/Mage";
import { Routes, Route } from 'react-router';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { AuthContextProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';


function App () {
  return (
    <>
      <AuthContextProvider>
        <Routes>
              <Route path="/" element={<PrivateRoute />}>
                <Route path="/" element={
                  <div id="game">
                    <Knight num={0} initPosition={{ top: 275, left: 60 }} initDirection={1} />
                    <Mage num={1} initPosition={{ top: 275, left: 850 }} initDirection={-1} />
                  </div>
                  } />
              </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>

       
      </AuthContextProvider>
    </>
  );
};

export default App;