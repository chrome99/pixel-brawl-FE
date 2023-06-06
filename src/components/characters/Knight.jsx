import React from 'react';
import './Knight.css';
import Player from './Player';

function Knight ({num, initPosition, initDirection, addCol, deleteCol, updateColPosition, playerStats, updateStats, pressedKeys}) {
  return (
      <Player num={num} type={'knight'} initPosition={initPosition} initDirection={initDirection} addCol={addCol} deleteCol={deleteCol} updateColPosition={updateColPosition} playerStats={playerStats} updateStats={updateStats} pressedKeys={pressedKeys} />
  );
};

export default Knight;