import React, { useState, useEffect } from 'react';
import './Player.css';

function Player () {
    
  const [position, setPosition] = useState({ top: 275, left: 60 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(1);
  const [action, setAction] = useState("idle");
//   const border = {top: 300, bottom: 400, right: 900, left: 50}
  const maxVelocity = 5;

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setAction("move");
          setVelocity((prevVelocity) => ({
            ...prevVelocity,
            y: Math.max(prevVelocity.y - 5, -maxVelocity),
          }));
          break;
        case 'ArrowDown':
          setAction("move");
          setVelocity((prevVelocity) => ({
            ...prevVelocity,
            y: Math.min(prevVelocity.y + 5, maxVelocity),
          }));
          break;
        case 'ArrowLeft':
          setAction("move");
          setDirection(-1);
          setVelocity((prevVelocity) => ({
            ...prevVelocity,
            x: Math.max(prevVelocity.x - 5, -maxVelocity),
          }));
          break;
        case 'ArrowRight':
          setAction("move");
          setDirection(1);
          setVelocity((prevVelocity) => ({
            ...prevVelocity,
            x: Math.min(prevVelocity.x + 5, maxVelocity),
          }));
          break;
        case 'z':
          setAction("attack");
          break;
        default:
          break;
      }
    };


    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
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
    if (action === "attack") {
      timer = setTimeout(() => {
        setAction("idle")
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [action])

  return (
    <div
    className={`player
    ${action === "move" && 'running'}
    ${action === "attack" && 'attacking'}
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