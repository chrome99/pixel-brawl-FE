import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../App.css";
import { Link } from "react-router-dom";
import Card from "../components/Card/Card";
import knight from "../assets/knight/knight.png";
import mage from "../assets/mage/mage.png";

const Character = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [room, setRoom] = useState("");

  const character = [
    { id: 1, img: knight, name: "Knight", feature: "sword", health: "100/100" },
    { id: 2, img: mage, name: "Mage", feature: "staff", health: "100/100" },
  ];

  const selectCard = (cardId) => {
    setSelectedCard(cardId);
  };

  const onChange = (e) => {
    setRoom(e.target.value);
  };

  return (
    <div>
      <Navbar />
      <div id="character">
        <div className="character-1">
          <h4>Player 1</h4>
          <div className="cards">
            {character.map((char) => (
              <div
                className={`character-card ${
                  selectedCard === char.id ? "selected" : ""
                }`}
                key={char.id}
                onClick={() => selectCard(char.id)}
              >
                <Card>
                  <img src={char.img} alt={char.name} />
                </Card>
                <h5>{char.name}</h5>
                <p>Weapon: {char.feature}</p>
                <p>Health: {char.health}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="character-2">
          <h4>Player 2</h4>
          <div className="cards">
            {character.map((char) => (
              <div
                className={`character-card ${
                  selectedCard === char.id ? "selected" : ""
                }`}
                key={char.id}
                onClick={() => selectCard(char.id)}
              >
                <Card>
                  <img src={char.img} alt={char.name} />
                </Card>
                <h5>{char.name}</h5>
                <p>Weapon: {char.feature}</p>
                <p>Health: {char.health}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="input-btn">
          <div className="room">
          <label style={{paddingRight: "1rem"}}>Set a room:</label>
          <input
            type="text"
            placeholder="Room"
            id="room"
            onChange={onChange}
            value={room}
          />
          </div>
          <Link className="link play" to="/">
            Play
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default Character;
