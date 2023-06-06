import React, { useState, useEffect } from 'react';
import './Player.css';

const allKeys = [
  {
    up: "w",
    down: "s",
    left: "a",
    right: "d",
    attack: "z",
  },
  {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    attack: "m"
  }
]

function Player({num, initPosition, initDirection, addCol, deleteCol, updateColPosition, playerStats, updateStats}) {
  const id = `player${num}`;
  const stats = playerStats.find((player) => player.id === id)
  const keys = allKeys[num];
  const [position, setPosition] = useState(initPosition);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(initDirection);
  const border = {top: 200, bottom: 400, right: 850, left: 50}
  const maxVelocity = 5;
  const speed = 5;
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (stats.action === "hurt") return;
      if (event.key === keys.up || event.key ===  keys.down || event.key === keys.left || event.key === keys.right) {
        if (stats.action !== "attack") {
          let newVelocity = {x: velocity.x, y: velocity.y};
          let direction = undefined;
          if (event.key === keys.up) {
            if (position.top > border.top) {
              newVelocity.y -= speed;
            }
            else {
              newVelocity.y = 0;
            }
          }
          if (event.key === keys.down) {
            if (position.top < border.bottom) {
              newVelocity.y += speed;
            }
            else {
              newVelocity.y = 0;
            }
          }
          if (event.key === keys.left) {
            if (position.left > border.left) {
              newVelocity.x -= speed;
              direction = -1;
            }
            else {
              newVelocity.x = 0;
            }
          }
          if (event.key === keys.right) {
            if (position.left < border.right) {
              newVelocity.x += speed;
              direction = 1;
            }
            else {
              newVelocity.x = 0;
            }
          }


          if (newVelocity.x > maxVelocity) {newVelocity.x = maxVelocity}
          if (newVelocity.y > maxVelocity) {newVelocity.y = maxVelocity}
          if (newVelocity.x < -maxVelocity) {newVelocity.x = -maxVelocity}
          if (newVelocity.y < -maxVelocity) {newVelocity.y = -maxVelocity}

          updateStats(id, "action", "move");
          setVelocity((prevVelocity) => ({...prevVelocity, x: newVelocity.x, y: newVelocity.y}));
          if (direction) {setDirection(direction)}
        }
      }
      if (event.key === keys.attack) {
        if (stats.action !== "attack") {
          const newLeft = direction === 1 ? position.left + 50: position.left - 110;
          updateColPosition(`${id}-attack1`, position.top + 110, newLeft);
          updateStats(id, "action", "attack");
          setTimeout(() => {
            updateColPosition(`${id}-attack1`, 0, 0)
            updateStats(id, "action", "idle")
          }, 1000)
        }
      }
    };


    const handleKeyUp = (event) => {
      switch (event.key) {
        case keys.up:
        case keys.down:
        case keys.left:
        case keys.right:
          setVelocity({ x: 0, y: 0 });
          updateStats(id, "action", "idle")
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

  //initialize player
  useEffect(() => {
    const otherPlayerNum = num === 1 ? 0 : 1;
    const actorCol = {top: 0, left: 0, width: 60, height: 50, id: id, type: "actor"};
    const attackCol = {top: 0, left: 0, width: 100, height: 30, id:`${id}-attack1`, type: "attack", target: `player${otherPlayerNum}`};
    addCol(actorCol);
    addCol(attackCol);

    return () => {
      deleteCol(id);
      deleteCol(`${id}-attack1`);
    }
  }, [])

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
    updateColPosition(`${id}`, position.top + 100, position.left - 10)
  }, [position])

  return (
    <div
    className={`player
    ${stats.action === "move" && 'running'}
    ${stats.action === "attack" && 'attacking'}
    ${stats.action === "hurt" && 'hurting'}
    `}
      style={{
        transform: `scaleX(${direction})`,
        top: position.top,
        left: position.left,
        zIndex: position.top,
      }}
    />
  );
};

export default Player;