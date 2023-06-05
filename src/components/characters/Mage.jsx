import React from 'react';
import './Mage.css';
import Player from './Player';

function Mage ({num, initPosition, initDirection}) {
  return (
      <Player num={num} initPosition={initPosition} initDirection={initDirection} type={'mage'}/>
  );
};

export default Mage;