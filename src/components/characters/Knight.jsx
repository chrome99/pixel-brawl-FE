import React from 'react';
import './Knight.css';
import Player from './Player';

function Knight ({num, initPosition, initDirection}) {
  return (
      <Player num={num} initPosition={initPosition} initDirection={initDirection} />
  );
};

export default Knight;