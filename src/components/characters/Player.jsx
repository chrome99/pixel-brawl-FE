import React, { useEffect } from 'react';
import { gameSocket } from '../../socket';
import './Player.css';
import './Mage.css';
import './Knight.css';

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

function Player({stats, thisUser, addCol, deleteCol, updateColPosition, updateStats}) {
  const id = stats.id;
  const keys = allKeys[0];
  const borderKnight = {top: 200, bottom: 390, right: 850, left: 50}
  const borderMage = {top: 155, bottom: 340, right: 850, left: 0}
  const border = stats.type === "knight" ? borderKnight : borderMage;
  const maxVelocity = 5;
  const speed = 5;
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (stats.action === "hurt" || stats.action === "attack") return;
      if (event.code === keys.up || event.code ===  keys.down || event.code === keys.left || event.code === keys.right) {
        let newVelocity = {x: stats.velocity.x, y: stats.velocity.y};
        let newDirection = undefined;
        if (event.code === keys.up) {
          if (stats.position.top > border.top) {
            newVelocity.y -= speed;
          }
          else {
            newVelocity.y = 0;
          }
        }
        if (event.code === keys.down) {
          if (stats.position.top < border.bottom) {
            newVelocity.y += speed;
          }
          else {
            newVelocity.y = 0;
          }
        }
        if (event.code === keys.left) {
          if (stats.position.left > border.left) {
            newVelocity.x -= speed;
            newDirection = -1;
          }
          else {
            newVelocity.x = 0;
          }
        }
        if (event.code === keys.right) {
          if (stats.position.left < border.right) {
            newVelocity.x += speed;
            newDirection = 1;
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
        updateStats(id, "velocity", {x: newVelocity.x, y: newVelocity.y});
        if (newDirection) {updateStats(id, "direction", newDirection)}
      }
      if (event.code === keys.attack) {
        let newLeft;
        if (stats.type === "knight") {
          newLeft = stats.direction === 1 ? stats.position.left + 50: stats.position.left - 110;
          updateColPosition(`${id}-attack1`, stats.position.top + 110, newLeft);
        }
        else if (stats.type === "mage") {
          newLeft = stats.direction === 1 ? stats.position.left + 90: stats.position.left - 70;
        updateColPosition(`${id}-attack1`, stats.position.top + 160, newLeft);
        }
        updateStats(id, "action", "attack");
        setTimeout(() => {
          updateColPosition(`${id}-attack1`, -100, -100)
          updateStats(id, "action", "idle")
        }, 1000)
      }
      if (event.code === keys.jump) {
        updateStats(id, "action", "jump");
        setTimeout(() => {
          updateStats(id, "action", "idle")
        }, 1000)
      }
    };


    const handleKeyUp = (event) => {
      switch (event.code) {
        case keys.up:
        case keys.down:
        case keys.left:
        case keys.right:
          updateStats(id, "velocity", {x: 0, y: 0});
          updateStats(id, "action", "idle")
          break;
        default:
          break;
      }
    };

    if (thisUser) {
      document.addEventListener('keydown', handleKeyPress);
      document.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keyup', handleKeyUp);
    }
  });

  //initialize player
  useEffect(() => {
    const otherPlayerNum = stats.num === 1 ? 0 : 1;
    const actorCol = {top: -100, left: -100, width: 60, height: 50, id: id, type: "actor"};
    const attackCol = {top: -100, left: -100, width: 100, height: 30, id:`${id}-attack1`, type: "attack", target: `player${otherPlayerNum}`};
    addCol(actorCol);
    addCol(attackCol);

    return () => {
      deleteCol(id);
      deleteCol(`${id}-attack1`);
    }
  }, [])

  useEffect(() => {
    function updatePosition() {
      updateStats(id, "position", {
        top: stats.position.top + stats.velocity.y,
        left: stats.position.left + stats.velocity.x,
      });
    }
    requestAnimationFrame(updatePosition);
  }, [stats.velocity])

  useEffect(() => {
    if (stats.type === "knight") {
      updateColPosition(`${id}`, stats.position.top + 100, stats.position.left - 10)
    }
    else if (stats.type === "mage") {
      updateColPosition(`${id}`, stats.position.top + 150, stats.position.left + 30)
    }
  }, [stats.position])

  return (
    <div
    className={`player
    ${stats.type}
    ${stats.action === "move" ? 'running' : ""}
    ${stats.action === "attack" ? 'attacking' : ""}
    ${stats.action === "jump" ? 'jumping' : ""}
    ${stats.action === "hurt" ? 'hurting' : ""}
    `}
      style={{
        transform: `scaleX(${stats.direction})`,
        top: stats.position.top,
        left: stats.position.left,
        zIndex: stats.position.top,
      }}
    />
  );
};

export default Player;