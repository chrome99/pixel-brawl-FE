import React, { useState } from 'react';
import './App.css';
import GamePage from './pages/GamePage';
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
            <Route path="/" element={<GamePage />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>       
      </AuthContextProvider>
    </>
  );
};

export default App;