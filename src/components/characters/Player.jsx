import React, { useEffect } from 'react';
import './Player.css';
import './Mage.css';
import './Knight.css';

const keys = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    attack: "KeyZ",
    attack2: "KeyX",
    jump: "Space"
}

function Player({stats, thisUser, matchWinner, otherPlayer, addCol, deleteCol, updateCol, updateStats}) {
  const id = stats.id;
  const borderKnight = {top: 200, bottom: 390, right: 850, left: 50}
  const borderMage = {top: 155, bottom: 340, right: 850, left: 0}
  const border = stats.type === "knight" ? borderKnight : borderMage;
  const maxVelocity = 8;
  const speed = 8;
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!(stats.action === "idle"  || stats.action === "move")) return;
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
          updateCol(`${id}-attack1`, stats.position.top + 110, newLeft);
        }
        else if (stats.type === "mage") {
          newLeft = stats.direction === 1 ? stats.position.left + 90: stats.position.left - 70;
        updateCol(`${id}-attack1`, stats.position.top + 160, newLeft);
        }
        updateStats(id, "action", "attack");
        setTimeout(() => {
          updateCol(`${id}-attack1`, -100, -200)
          updateStats(id, "action", "idle")
        }, 1000)
      }
      if (event.code === keys.attack2) {
        let newLeft;
        if (stats.type === "knight") {
          newLeft = stats.direction === 1 ? stats.position.left + 50: stats.position.left - 110;
          updateCol(`${id}-attack2`, stats.position.top + 110, newLeft);
        }
        else if (stats.type === "mage") {
          newLeft = stats.direction === 1 ? stats.position.left + 90: stats.position.left - 70;
        updateCol(`${id}-attack2`, stats.position.top + 160, newLeft);
        }
        updateStats(id, "action", "attack2");
        setTimeout(() => {
          updateCol(`${id}-attack2`, -100, -200)
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

    if (thisUser && matchWinner === "") {
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
    if (!otherPlayer) return;

    const actorCol = {top: -100, left: -100, width: 60, height: 50, id: `${id}-col`, type: "actor"};
    const attackCol = {top: -100, left: -200, width: 100, height: 30, id:`${id}-attack1`, type: "attack", target: `${otherPlayer}-col`};
    const attack2Col = {top: -100, left: -200, width: 100, height: 30, id:`${id}-attack2`, type: "attack", target: `${otherPlayer}-col`};
    addCol(actorCol);
    addCol(attackCol);
    addCol(attack2Col);

    return () => {
      deleteCol(`${id}-col`);
      deleteCol(`${id}-attack1`);
      deleteCol(`${id}-attack2`);
    }
  }, [otherPlayer])

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
      updateCol(`${id}-col`, stats.position.top + 100, stats.position.left - 10)
    }
    else if (stats.type === "mage") {
      updateCol(`${id}-col`, stats.position.top + 150, stats.position.left + 30)
    }
  }, [stats.position])

  return (
    <div
    className={`player
    ${stats.type}
    ${stats.action === "move" ? 'running' : ""}
    ${stats.action === "attack" ? 'attacking' : ""}
    ${stats.action === "attack2" ? 'attacking2' : ""}
    ${stats.action === "jump" ? 'jumping' : ""}
    ${stats.action === "hurt" ? 'hurting' : ""}
    ${stats.action === "dying" ? 'dying' : ""}
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