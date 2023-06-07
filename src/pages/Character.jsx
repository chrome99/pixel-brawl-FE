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
  const { user, setUser } = useContext(AuthContext)
  const [cardLeft, setCardLeft] = useState(null);
  const [cardRight, setCardRight] = useState(null);
  const [room, setRoom] = useState("");
  const [allAboard, setAllAboard] = useState(false);
  const [usernames, setUsernames] = useState(null);
  const [message, setMessage] = useState("");

  const character = [
    { id: 1, img: knight, name: "Knight", feature: "sword", health: "100/100" },
    { id: 2, img: mage, name: "Mage", feature: "staff", health: "100/100" },
  ];
  const characterString = ["", "knight", "mage"];

  function joinRoom() {
    userSocket.emit("joinRoom", {userId: user.id, username: user.username, room: room});
  }

  function selectCard (cardId, right) {
    if ((right && user.num === 1) || (!right && user.num === 0)) {
      userSocket.emit("updateRole", {cardId: cardId, right: right, room: room});
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

  function onJoinRoom(data) {
    const { num, message, userId } = data;

    if (userId === user.id) {
      user.num = num;
      setUser((prev) => {
        return {...prev, num: num}
      });
    }

    setMessage(message);
  }

  function onAllAboard(data) {
    setTimeout(() => {
      console.log("All Aboard!");
      setAllAboard(true);
      setUsernames(data);
    }, 1000)
  }

  useEffect(() => {
    if (!user || !user.id) return;

    userSocket.connect();

    userSocket.emit("joinMyRoom", user.id);

    userSocket.on("joinRoom", onJoinRoom);
    userSocket.on("allAboard", onAllAboard);

    return () => {
      userSocket.disconnect();
    }
  }, [!!user])

  useEffect(()=> {
    if (!user || !user.id || !allAboard) return;

    console.log(user);

    userSocket.on("updateRole", onUpdateRole);
  }, [!!user, allAboard])

  function submit() {
    if (!cardLeft || !cardRight || !room) return;

    user.character = user.num === 0 ? characterString[cardLeft] : characterString[cardRight];
    user.room = room;
    setUser((prev) => {
      return {...prev,
        character: prev.num === 0 ? characterString[cardLeft] : characterString[cardRight],
        room: room
      }
    });
    navigate("/");
  }

  return (
    <div>
      <Navbar />
      <div id="characterSelect">
        {allAboard ? 
        <div id="character">
          <div className="character-1">
            <h4>{usernames[0]}</h4>
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
            <h4>{usernames[1]}</h4>
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
            <div className="link play" onClick={submit}>
              Play
            </div>
          </div>
        </div>
        :
        <div className="room">
          <label style={{paddingRight: "1rem"}}>Enter room name:</label>
          <input
            type="text"
            placeholder="Room"
            id="room"
            onChange={(e) => setRoom(e.target.value)}
            value={room}
          />
          <div className="link" onClick={joinRoom}>
            Join
          </div>
          <div id="serverMessage">{message}</div>
        </div>
        }
      </div>
  </div>
  );
};

export default Character;
