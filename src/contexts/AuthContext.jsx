import React, { createContext, useEffect, useState } from "react";
import * as userServices from "../services/userServices";

const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const resetUser = (data) => {
    setUser({
      _id: data._id,
      role: data.role,
      username: data.username,
      email: data.email,
    });
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const data = await userServices.getUser();
      if (data) {
        resetUser(data);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    })();
  }, []);

  const signup = async (user) => {
    try {
      setIsLoading(true);
      const newUser = await userServices.signup(user);
      resetUser(newUser);
      setIsLoggedIn(true);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  }; 

  const login = async (user) => {
    try {
      const data = userServices.login(user);
      if (data) {
        setIsLoggedIn(true);
        resetUser(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await userServices.logout();
      setIsLoading(false);
      setIsLoggedIn(false);
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, login, signup, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
