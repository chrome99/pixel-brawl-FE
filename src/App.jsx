import React, { useState } from 'react';
import './App.css';
import GamePage from './pages/GamePage';
import { Routes, Route } from 'react-router';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { AuthContextProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Character from './pages/Character';
import Category from './pages/Category';


function App () {
  return (
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route index path="/" element={<GamePage />} />
            <Route path="/character" element={<Character />} /> 
            <Route path="/category/:categoryName" element={<Category />} /> 
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthContextProvider>

  );
};

export default App;