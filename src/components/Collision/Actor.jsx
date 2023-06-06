import React from 'react';
import './Actor.css';

function Actor({col}) {

  return (
    <div
    className={`col actor`}
      style={{
        top: col.top,
        left: col.left,
        width: col.width,
        height: col.height
      }}
    ></div>
  );
};

export default Actor;