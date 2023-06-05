import React from 'react';
import './App.css';
import Knight from "./components/characters/Knight";
import Mage from "./components/characters/Mage";

function App () {
  return (
    <div id="game">
      <Knight num={0} initPosition={{ top: 275, left: 60 }} initDirection={1} />
      <Mage num={1} initPosition={{ top: 275, left: 850 }} initDirection={-1} />
    </div>
  );
};

export default App;