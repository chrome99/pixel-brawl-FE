import React, { useState } from 'react';
import './App.css';
import GamePage from './pages/GamePage';
import { Routes, Route } from 'react-router';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { AuthContextProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Character from './pages/Character';
import Scores from './pages/Scores';


function App () {
  return (
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
          <Route index path="/" element={<GamePage />} />
          <Route path="/character" element={<Character />} /> 
          <Route path="/scores" element={<Scores />} /> 
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthContextProvider>

  );
};

export default App;