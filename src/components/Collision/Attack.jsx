import React, { useEffect } from 'react';
import './Attack.css';
import { colOverlap } from '../../services/globalServices';

function Attack({col, colObjects, updateStats, takeDamage}) {
  
  useEffect(() => {
    const targetCol = colObjects.find((obj) => obj.id === col.target);
    const result = colOverlap(col, targetCol);
    if (result) {
      updateStats(col.target, "action", "hurt");
      takeDamage(col.target, 5)
      setTimeout(() => {
        updateStats(col.target, "action", "idle");
      }, 1000)
    }
  }, [col.top, col.left])

  return (
    <div
    className={`col attack`}
      style={{
        top: col.top,
        left: col.left,
        width: col.width,
        height: col.height
      }}
    ></div>
  );
};

export default Attack;