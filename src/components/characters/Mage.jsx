import React from 'react';
import './Mage.css';
import Player from './Player';

function Mage ({num, initPosition, initDirection, addCol, deleteCol, updateColPosition, playerStats, updateStats, pressedKeys}) {
  return (
      <Player num={num} type={'mage'} initPosition={initPosition} initDirection={initDirection} addCol={addCol} deleteCol={deleteCol} updateColPosition={updateColPosition} playerStats={playerStats} updateStats={updateStats} pressedKeys={pressedKeys} />
  );
};

export default Mage;