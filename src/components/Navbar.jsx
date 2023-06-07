import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../App.css";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation()

  if (!isLoggedIn) {
    return null
  }

   const handleLogout = async () => {
     try {
       await logout()
       navigate("/login")
     } catch (err) {
       console.log(err)
     }
  };
  
  return (
    <div id="navbar">
      {location.pathname === "/scores" ||
      location.pathname.startsWith("/category/") ? (
        <div>
          <Link className="link matches" to="/category/scores">
            Scores
          </Link>
          <Link className="link matches" to="/category/user-scores">
            My Scores
          </Link>
          <Link className="link char" to="/character">
            Play
          </Link>
        </div>
      ) : (
        <Link className="link" to="/category/scores">
          Scores
        </Link>
      )}
      <Link className="link" style={{ color: "#fff" }} onClick={handleLogout}>
        Logout
      </Link>
    </div>
  );
};

export default Navbar;
