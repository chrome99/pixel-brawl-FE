import React, { useContext } from 'react'
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from '../contexts/AuthContext'

const PrivateRoute = () => {
  const { isLoggedIn } = useContext(AuthContext)

  return isLoggedIn ? <Outlet /> : <Navigate to="/signup" />;
}

export default PrivateRoute
