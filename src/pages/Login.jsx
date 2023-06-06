import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../App.css"; 

const Login = () => {
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: undefined,
    password: undefined,
  });


  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      await login(formData)
      navigate("/")
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div id="showcase">
      <div className="showcase-container">
        <h3>LogIn</h3>
        <form className="form-container" onSubmit={handleLogIn}>
          <input
            type="email"
            placeholder="Email"
            id="email"
            onChange={onChange}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            onChange={onChange}
          />
          <button className="btn-block">LogIn</button>
          <div>
            Need an account?
            <Link className="link" to={"/signup"}>
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
