import React, { useState, useEffect } from 'react';
import { gameSocket } from '../../socket';
import './Player.css';

const allKeys = [
  {
    up: "KeyW",
    down: "KeyS",
    left: "KeyA",
    right: "KeyD",
    attack: "KeyZ",
    jump: "KeyX"
  },
  {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    attack: "KeyM",
    jump: "Space"
  }
]

function Player({num, initPosition, initDirection, type}) {
  
  const keys = allKeys[num]; 

  const [position, setPosition] = useState(initPosition);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(initDirection);
  const [action, setAction] = useState("idle");
  const border = {top: 200, bottom: 500, right: 1100, left: 50}
  const maxVelocity = 5;

  useEffect(()=>{
   
    gameSocket.emit("position", {position, num, room: "room1"})
    gameSocket.emit("velocity", {velocity, num, room: "room1"})
    gameSocket.emit("action", {action, num, room: "room1"})
    gameSocket.emit("direction", {direction, num, room: "room1"})

  }, [position, velocity, action, direction])

  useEffect(() => {
    const handleKeyPress = (event) => {
      console.log(event.code, event.key)
      switch (event.code) {
        case keys.up:
          if (position.top > border.top) {
            setAction("move");
            setVelocity((prevVelocity) => ({
              ...prevVelocity,
              y: Math.max(prevVelocity.y - 5, -maxVelocity),
            }));
          }
          break;
        case keys.down:
          if (position.top < border.bottom) {
            setAction("move");
            setVelocity((prevVelocity) => ({
              ...prevVelocity,
              y: Math.min(prevVelocity.y + 5, maxVelocity),
            }));
          }
          break;
        case keys.left:
          if (position.left > border.left) {
            setAction("move");
            setDirection(-1);
            setVelocity((prevVelocity) => ({
              ...prevVelocity,
              x: Math.max(prevVelocity.x - 5, -maxVelocity),
            }));
          }
          break;
        case keys.right:
          if (position.left < border.right) {
            setAction("move");
            setDirection(1);
            setVelocity((prevVelocity) => ({
              ...prevVelocity,
              x: Math.min(prevVelocity.x + 5, maxVelocity),
            }));
          }
          break;
        case keys.attack:
          setAction("attack");
          break;
        case keys.jump:
          setAction("jump");
          break;
        default:
          break;
      }
    };


    const handleKeyUp = (event) => {
      switch (event.code) {
        case keys.up:
        case keys.down:
        case keys.left:
        case keys.right:
          setVelocity({ x: 0, y: 0 });
          setAction("idle");
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keyup', handleKeyUp);
    }
  });

  useEffect(() => {
    function updatePosition() {
      setPosition((prevPosition) => ({
        top: prevPosition.top + velocity.y,
        left: prevPosition.left + velocity.x,
      }));
    }
    requestAnimationFrame(updatePosition);
  }, [velocity])
  
  useEffect(() => {
    let timer;
    if (action === "attack" || action === "jump") {
      timer = setTimeout(() => {
        setAction("idle")
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [action])

  return (
    <div
    className={`player
    ${type}
    ${action === "move" ? 'running' : ""}
    ${action === "attack" ? 'attacking' : ""}
    ${action === "jump" ? 'jumping' : ""}
    `}
      style={{
        transform: `scaleX(${direction})`,
        top: position.top,
        left: position.left,
      }}
    ></div>
  );
};

export default Player;