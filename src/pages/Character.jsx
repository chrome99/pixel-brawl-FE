import React, { useState, useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../App.css";
import { Link } from "react-router-dom";
import Card from "../components/Card/Card";
import knight from "../assets/knight/knight.png";
import mage from "../assets/mage/mage.png";
import { userSocket } from "../socket";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Character = () => {
  const navigate = useNavigate();
  const { user, setUser, isLoggedIn } = useContext(AuthContext)
  const [cardLeft, setCardLeft] = useState(null);
  const [cardRight, setCardRight] = useState(null);
  const [room, setRoom] = useState("");

  const character = [
    { id: 1, img: knight, name: "Knight", feature: "sword", health: "100/100" },
    { id: 2, img: mage, name: "Mage", feature: "staff", health: "100/100" },
  ];
  const characterString = ["knight", "mage"];

  function onGetUserNum(data) {
    const { num, id } = data;
    if (id === user.id) {
      user.num = num;
      setUser((prev) => {
        return {...prev, num: num}
      });
    }
  }

  function selectCard (cardId, right) {
    if ((right && user.num === 1) || (!right && user.num === 0)) {
      userSocket.emit("updateRole", {cardId: cardId, right: right});
    }
  };

  function onUpdateRole(data) {
    const { cardId, right } = data;
    if (right) {
      setCardRight(cardId);
    } else {
      setCardLeft(cardId);
    }
  }

  function onChange(e) {
    userSocket.emit("updateRoom", (e.target.value));
  };

  function onUpdateRoom(data) {
    setRoom(data);
  }

  useEffect(()=> {
    if (!user || !user.id) return;

    console.log("hi")

    userSocket.connect();

    userSocket.emit("getUserNum", {id: user.id});

    userSocket.on("getUserNum", onGetUserNum);
    userSocket.on("updateRole", onUpdateRole);
    userSocket.on("updateRoom", onUpdateRoom);
    return () => {
      userSocket.disconnect();
    }
  }, [!!user])

  console.log(cardLeft, cardRight);


  function submit() {
    if (!cardLeft || !cardRight || !room) return;

    user.role = user.num === 0 ? characterString[cardLeft] : characterString[cardRight];
    user.room = room;
    setUser((prev) => {
      return {...prev,
        role: prev.num === 0 ? characterString[cardLeft] : characterString[cardRight],
        room: room
      }
    });
    navigate("/");
  }

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
                  cardLeft === char.id ? "selected" : ""
                }`}
                key={char.id}
                onClick={() => selectCard(char.id, false)}
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
                  cardRight === char.id ? "selected" : ""
                }`}
                key={char.id}
                onClick={() => selectCard(char.id, true)}
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
          <div className="link play" onClick={submit}>
            Play
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Character;
