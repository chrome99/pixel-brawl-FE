import React, { useState, useEffect } from 'react';
import './Attack.css';
import { colOverlap } from '../../services/globalServices';

function Attack({col, colObjects, matchWon, playerStats, updateStats}) {
  const [projected, setProjected] = useState();
  
  useEffect(() => {
    const targetCol = colObjects.find((obj) => obj.id === col.target);
    if (targetCol) {
      setProjected(targetCol);
      const result = colOverlap(col, targetCol);
      if (result) {
        const max = 20, min = 10;
        const randomDamge = Math.floor(Math.random() * (max - min + 1) + min);

        const originPlayerId = col.target.split("-")[0];
        const originPlayer = playerStats.find((p) => p.id === originPlayerId);
        const targetPlayerId = col.target.split("-")[0];
        const targetPlayer = playerStats.find((p) => p.id === targetPlayerId);
        
        //if player will die from this attack
        if (targetPlayer.health - randomDamge <= 0) {
          updateStats(targetPlayerId, "score", originPlayer.score + 1)

          updateStats(targetPlayerId, "action", "dying");
          updateStats(targetPlayerId, "health", "0");
          if (originPlayer.score + 1 >= 3) {
            matchWon(originPlayer.username);
          }
          else {
            setTimeout(() => {
              updateStats(targetPlayerId, "health", "100");
              updateStats(targetPlayerId, "action", "idle");
            }, 2000)
          }
        }
        else {
          updateStats(targetPlayerId, "health", targetPlayer.health - randomDamge)
          updateStats(targetPlayerId, "action", "hurt");
          setTimeout(() => {
            updateStats(targetPlayerId, "action", "idle");
          }, 1000)
        }
      }
    }
  }, [col])

  return (
    <>
    <div
    className={`col attack`}
      style={{
        top: col.top,
        left: col.left,
        width: col.width,
        height: col.height
      }}
    ></div>
    {projected ? 
      <div
      className={`col attack projected`}
        style={{
          top: projected.top,
          left: projected.left,
          width: projected.width,
          height: projected.height
        }}
      ></div>
    : ""}
    </>
  );
};

export default Attack;