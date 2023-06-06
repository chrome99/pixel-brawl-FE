import React, { useState, useEffect } from 'react';
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

function Player({num, type, position, direction, addCol, deleteCol, updateColPosition, playerStats, updateStats}) {
  const id = `player${num}`;
  const stats = playerStats.find((player) => player.id === id)
  const keys = allKeys[num];
  const border = {top: 200, bottom: 400, right: 850, left: 50}
  const maxVelocity = 5;
  const speed = 5;

  useEffect(()=> {
    gameSocket.emit("position", {position: stats.position, num, room: "room1"})
    gameSocket.emit("velocity", {velocity: stats.velocity, num, room: "room1"})
    gameSocket.emit("action", {action: stats.action, num, room: "room1"})
    gameSocket.emit("direction", {direction: stats.direction, num, room: "room1"})

  }, [stats.position, stats.velocity, stats.action, stats.direction])
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (stats.action === "hurt" || stats.action === "attack") return;
      if (event.code === keys.up || event.code ===  keys.down || event.code === keys.left || event.code === keys.right) {
        let newVelocity = {x: stats.velocity.x, y: stats.velocity.y};
        let direction = undefined;
        if (event.code === keys.up) {
          if (position.top > border.top) {
            newVelocity.y -= speed;
          }
          else {
            newVelocity.y = 0;
          }
        }
        if (event.code === keys.down) {
          if (position.top < border.bottom) {
            newVelocity.y += speed;
          }
          else {
            newVelocity.y = 0;
          }
        }
        if (event.code === keys.left) {
          if (position.left > border.left) {
            newVelocity.x -= speed;
            direction = -1;
          }
          else {
            newVelocity.x = 0;
          }
        }
        if (event.code === keys.right) {
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
        updateStats(id, "velocity", {x: newVelocity.x, y: newVelocity.y});
        if (direction) {updateStats(id, "direction", direction)}
      }
      if (event.code === keys.attack) {
        let newLeft;
        if (type === "knight") {
          newLeft = direction === 1 ? position.left + 50: position.left - 110;
          updateColPosition(`${id}-attack1`, position.top + 110, newLeft);
        }
        else if (type === "mage") {
          newLeft = direction === 1 ? position.left + 90: position.left - 70;
        updateColPosition(`${id}-attack1`, position.top + 160, newLeft);
        }
        updateStats(id, "action", "attack");
        setTimeout(() => {
          updateColPosition(`${id}-attack1`, 0, 0)
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
      updateStats(id, "position", {
        top: stats.position.top + stats.velocity.y,
        left: stats.position.left + stats.velocity.x,
      });
    }
    requestAnimationFrame(updatePosition);
  }, [stats.velocity])

  useEffect(() => {
    if (type === "knight") {
      updateColPosition(`${id}`, position.top + 100, position.left - 10)
    }
    else if (type === "mage") {
      updateColPosition(`${id}`, position.top + 150, position.left + 30)
    }
  }, [position])

  return (
    <div
    className={`player
    ${type}
    ${stats.action === "move" ? 'running' : ""}
    ${stats.action === "attack" ? 'attacking' : ""}
    ${stats.action === "jump" ? 'jumping' : ""}
    ${stats.action === "hurt" ? 'hurting' : ""}
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