import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../App.css"; 



const Signup = () => {
  const { signup } = useContext(AuthContext)
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const { username, email, password, rePassword } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const SignUpUser = async (e) => {
    e.preventDefault();
     try {
       const newUser = await signup({
         username,
         email,
         password,
         rePassword
       });

       navigate("/login");
     } catch (err) {
       console.log(err);
     }
  };

  return (
    <div id="showcase">
      <div className="showcase-container">
          <h3>Sign Up</h3>
          <form className="form-container" onSubmit={SignUpUser}>
            <input
              type="text"
              placeholder="Name"
              id="username"
              value={username}
              onChange={onChange}
            />
            <input
              type="email"
              placeholder="Email"
              id="email"
              value={email}
              onChange={onChange}
            />
            <input
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
            />
            <input
              type="password"
              placeholder="Confirm password"
              id="rePassword"
              value={rePassword}
              onChange={onChange}
            />

            <button type="submit" className="btn-block">
              Sign Up
            </button>
            <div>
              Already a member?
              <Link className="link" to={"/login"}>LogIn</Link>
            </div>
          </form>
      </div>
    </div>
  );
};

export default Signup;
