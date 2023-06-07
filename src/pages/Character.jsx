import React from 'react'
import Navbar from '../components/Navbar'
import "../App.css"
import { Link } from "react-router-dom";

const Character = () => {
  return (
    <div>
      <Navbar />
      <div id="character">
        <div className="character-1">
          <h4>Player 1</h4>
          
        </div>
        <div className="character-2">
          <h4>Player 2</h4>
        </div>
        <Link className="link play" to="/">Play</Link>
      </div>
    </div>
  );
}

export default Character
