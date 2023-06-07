import React, { useState, useEffect } from 'react';
import './Attack.css';
import { colOverlap } from '../../services/globalServices';

function Attack({col, colObjects, updateStats, takeDamage}) {
  const [projected, setProjected] = useState();
  
  useEffect(() => {
    const targetCol = colObjects.find((obj) => obj.id === col.target);
    if (targetCol) {
      setProjected(targetCol);
      const result = colOverlap(col, targetCol);
      if (result) {
        const max = 30, min = 10;
        const randomDamge = Math.floor(Math.random() * (max - min + 1) + min);

        const targetPlayer = col.target.split("-")[0];

        updateStats(targetPlayer, "action", "hurt");
        takeDamage(targetPlayer, randomDamge)
        setTimeout(() => {
          updateStats(targetPlayer, "action", "idle");
        }, 1000)
      }
    }
  }, [col.top, col.left])

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